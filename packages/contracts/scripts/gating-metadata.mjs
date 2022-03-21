#!/usr/bin/env node
// @ts-nocheck

import path from 'path'
import { fileURLToPath } from 'url'
import { CarReader } from '@ipld/car'
import glob from 'glob'
import JSON5 from 'json5'
import chalk from 'chalk'
import { NFTStorage, File } from 'nft.storage'
import fs from 'fs'
import { packToFs } from 'ipfs-car/pack/fs'
import { FsBlockStore } from 'ipfs-car/blockstore/fs'
import hardhat from 'hardhat'

const { config, ethers } = hardhat
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const artifactsDir = path.join(__dirname, '../artifacts/')

if(!process.env.NFT_STORAGE_API_KEY) {
  throw new Error('Missing `NFT_STORAGE_API_KEY`.')
}
const storage = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY })

const { abi, contractName } = JSON.parse(await (
  fs.promises.readFile(
    path.join(
      artifactsDir,
      'src/BulkDisbersableNFTs.sol/BulkDisbersableNFTs.json'
    )
  )
))

const contractAddress = (await (
  fs.promises.readFile(
    path.join(
      artifactsDir,
      'BulkDisbersableNFTs.address'
    )
  )
))
.toString()
.trim()

const contract = await ethers.getContractAt(abi, contractAddress)

const metadataDir = path.join(__dirname, '../metadata')
const assetsDir = path.join(metadataDir, 'assets')
const assetsCar = path.join(metadataDir, 'assets.car')

const relative = (path) => {
  const CWD = process.cwd()
  if(path.startsWith(CWD)) {
    path = path.substring(CWD.length)
    path = path.replace(/^\//, '')
  }
  return path
}

const carResult = await packToFs({
  input: assetsDir,
  output: assetsCar,
  blockstore: new FsBlockStore(),
  wrapWithDirectory: false,
})

const assetsCID = carResult.root.toString()
console.info(
  ` 🎼 Saved contents of ${chalk.hex('#FF7011')(relative(assetsDir))}`
  + ` to ${chalk.hex('#4CFF0B')(relative(assetsCar))}`
  + ` with root ${chalk.hex('#9E59FF')(assetsCID)}.`
)

const nftStorageAssetsCID = await storage.storeCar(
  await CarReader.fromIterable(
    fs.createReadStream(carResult.filename)
  )
)
console.info(
  ` 🍿 Uploaded ${chalk.hex('#4CFF0B')(relative(assetsCar))}`
  + ` with root ${chalk.hex('#9E59FF')(nftStorageAssetsCID)}.`
)

const templates = path.join(metadataDir, 'templates', '*.json5')
const files = await Promise.all(
  glob.sync(templates).map(async (file) => {
    const type = file.replace(/^.*\//, '').replace(/\.json5$/, '')
    console.debug(
      ` 🤖 Loading ${chalk.hex('#FF40CC')(type.toUpperCase())} template:`
      + ` ${chalk.hex('#FFF01D')(relative(file))}.`
    )
    const template = await JSON5.parse(
      await fs.promises.readFile(file)
    )
    ;['image', 'animation_url'].forEach((prop) => {
      if(template[prop]) {
        template[prop] = encodeURI(
          template[prop].replace(/\{assets-cid\}/g, assetsCID)
        )
      }
    })
    return new File(
      JSON.stringify(template, null, 2),
      `${type}.json`,
      { type: 'application/json' },
    )
  })
)

const metadataCID = await storage.storeDirectory(files)
console.info(
  ` 🍿 Transformed ${chalk.hex('#4CFF0B')(relative(templates))}`
  + ` & uploaded to root ${chalk.hex('#9E59FF')(metadataCID)}.`
)

for(const file of files) {
  const type = file.name.replace(/\.json$/, '').toUpperCase()
  const tokenIdFunction = contract[`${type}_TOKEN`]
  if(!tokenIdFunction) {
    console.debug(
      `Couldn't find \`${type}_TOKEN\` on ${contractName}.`
    )
  } else {
    const tokenId = await tokenIdFunction.call()
    const uri = `ipfs://${metadataCID}/${file.name}`
    const hex = (
      tokenId.toHexString()
      .replace(/^0x/, '')
      .padStart(64, '0')
      .toUpperCase()
    )
    const existing = await contract.uri(tokenId)
    if(existing === uri) {
      console.info(
        ` ✴ Token URI for`
        + ` ${chalk.hex('#6E9AFF')(`0x${hex}`)}`
        + ` already set to ${chalk.hex('#FF069C')(uri)}.`
      )
    } else {
      console.info(
        ` ✂ Setting token id`
        + ` ${chalk.hex('#6E9AFF')(`0x${hex}`)}`
        + ` URI to ${chalk.hex('#FF069C')(uri)}.`
      )
      const tx = await contract.setURI(uri, tokenId)
      await tx.wait()
    }
  }
}