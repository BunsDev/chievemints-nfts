import { aA as useParams, r as react, e as useWeb3, j as jsxs, a as jsx, H as HelmetExport, a1 as Spinner, F as Fragment } from "./index.35c474d9.js";
import { x as capitalize, C as Container, S as Stack, T as Text, F as Flex, O as OrderedList, s as ListItem, h as httpURL } from "./LinkedSVG.4242533a.js";
import { H as HomeLink } from "./HomeLink.7eb5c919.js";
import { u as useToast, T as Tabs, a as TabList, b as Tab, c as TabPanels, d as TabPanel, f as Textarea, R as RadioGroup, e as Radio } from "./chakra-ui-toast.esm.e52c4295.js";
import { A as Alert, a as AlertIcon, b as AlertTitle, c as AlertDescription } from "./chakra-ui-alert.esm.2ca08f53.js";
import { F as FormControl, a as FormLabel, B as Button } from "./chakra-ui-form-control.esm.c27e1ea4.js";
import { C as Checkbox } from "./chakra-ui-checkbox.esm.6ff92e16.js";
const Address = ({
  name
}) => {
  const {
    ensProvider
  } = useWeb3();
  const isAddress = react.exports.useMemo(() => /^0x[a-z0-9]{40}$/i.test(name), [name]);
  const [address, setAddress] = react.exports.useState(isAddress ? void 0 : null);
  react.exports.useMemo(() => {
    if (!isAddress) {
      const resolve = async () => {
        const resolved = await ensProvider?.resolveName(name);
        setAddress(resolved ?? "Not Found");
      };
      resolve();
    }
  }, [isAddress, ensProvider, name]);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsxs(Text, {
      children: [name, address != null && /* @__PURE__ */ jsxs(Text, {
        ml: 2,
        as: "em",
        children: ["(", address, ")"]
      })]
    }), address === null && /* @__PURE__ */ jsx(Spinner, {
      size: "xs"
    })]
  });
};
const split = (raw) => raw.split(/\s*[\s,;:/\\|]+\s*/).filter((str) => str && str !== "");
const Disburse = () => {
  let {
    nftId: tokenId
  } = useParams();
  if (Array.isArray(tokenId)) {
    [tokenId] = tokenId;
  }
  const [balance, setBalance] = react.exports.useState();
  const [metadata, setMetadata] = react.exports.useState();
  const [error, setError] = react.exports.useState();
  const [raw, setRaw] = react.exports.useState("");
  const [action, setAction] = react.exports.useState("whitelist");
  const {
    ensProvider,
    address,
    roContract,
    rwContract,
    connected,
    connect,
    userProvider
  } = useWeb3();
  const [addresses, setAddresses] = react.exports.useState([]);
  const toast = useToast();
  react.exports.useEffect(() => {
    const parse = async () => {
      setAddresses(split(raw).map((name2, idx) => /* @__PURE__ */ jsx(Address, {
        name: name2
      }, idx)));
    };
    parse();
  }, [ensProvider, raw]);
  const name = react.exports.useMemo(() => metadata?.name ?? `#${tokenId}`, [metadata, tokenId]);
  react.exports.useEffect(() => {
    const getBalance = async () => {
      if (roContract && address && tokenId) {
        try {
          setBalance(Number((await roContract.balanceOf(address, tokenId)).toString()));
        } catch (err) {
          setError(err.message);
        }
      }
    };
    getBalance();
  }, [address, roContract, tokenId]);
  react.exports.useEffect(() => {
    const getMetadata = async () => {
      if (roContract && tokenId) {
        try {
          const meta = await roContract.uri(tokenId);
          if (!meta) {
            setMetadata(null);
          } else {
            const response = await fetch(httpURL(meta));
            setMetadata(await response.json());
          }
        } catch (err) {
          setError(err.message);
        }
      }
    };
    getMetadata();
  }, [roContract, tokenId]);
  const submit = react.exports.useCallback(async (evt) => {
    evt.preventDefault();
    if (!rwContract) {
      toast({
        title: "Contract Error!",
        description: "Token is not Connected.",
        status: "error",
        isClosable: true,
        duration: 1e4
      });
      return;
    }
    try {
      const addrs = await Promise.all(split(raw).map(async (name2) => {
        const response = await ensProvider?.resolveName(name2);
        if (!response) {
          throw new Error(`Couldn't Resolve Name: \u201C${name2}\u201D`);
        }
        return response;
      }));
      switch (action) {
        case "mint": {
          const tx = await rwContract?.["mint(address[],uint256,bytes)"](addrs, tokenId, []);
          await tx.wait();
          break;
        }
        case "whitelist": {
          console.debug("whitelist", {
            addrs
          });
          addrs.map(async (addr) => {
            const minterRole = await roContract?.roleIndexForName("Minter");
            const tx = await rwContract?.["mint(address,uint256,uint256,bytes)"](addr, tokenId, 1, []);
          });
          break;
        }
      }
    } catch (err) {
      toast({
        title: `${capitalize(action)}ing Error`,
        description: err.message,
        status: "error",
        isClosable: true,
        duration: 1e4
      });
    }
  }, [action, addresses, ensProvider, roContract, rwContract, tokenId]);
  if (error) {
    return /* @__PURE__ */ jsxs(Alert, {
      status: "error",
      children: [/* @__PURE__ */ jsx(AlertIcon, {}), /* @__PURE__ */ jsx(AlertTitle, {
        mr: 2,
        children: "Error: Loading NFT"
      }), /* @__PURE__ */ jsx(AlertDescription, {
        children: error
      })]
    });
  }
  return /* @__PURE__ */ jsxs(Container, {
    maxW: "40rem",
    children: [/* @__PURE__ */ jsxs(HelmetExport, {
      children: [/* @__PURE__ */ jsxs("title", {
        children: ["Disburse NFT #", tokenId]
      }), /* @__PURE__ */ jsx("meta", {
        name: "description",
        content: "Distribute A \u2019Chievemint NFT"
      })]
    }), /* @__PURE__ */ jsx(HomeLink, {}), /* @__PURE__ */ jsxs(Stack, {
      as: "form",
      onSubmit: submit,
      children: [(() => {
        if (metadata === null) {
          return /* @__PURE__ */ jsxs(Text, {
            my: 8,
            children: ["Token ", name, " does not exist."]
          });
        } else if (!address) {
          return /* @__PURE__ */ jsxs(Text, {
            my: 8,
            children: ["Connect your wallet to distribute \u201C", name, "\u201D tokens\u2026"]
          });
        } else if (balance == null) {
          return /* @__PURE__ */ jsxs(Flex, {
            my: 8,
            children: [/* @__PURE__ */ jsx(Spinner, {}), /* @__PURE__ */ jsx(Text, {
              ml: 2,
              children: "Loading Balance\u2026"
            })]
          });
        } else {
          return /* @__PURE__ */ jsxs(Text, {
            my: 8,
            children: ["Distribute up to ", balance, " \u201C", name, "\u201D tokens:"]
          });
        }
      })(), /* @__PURE__ */ jsxs(Tabs, {
        isFitted: true,
        variant: "enclosed",
        children: [/* @__PURE__ */ jsxs(TabList, {
          mb: "1em",
          children: [/* @__PURE__ */ jsx(Tab, {
            children: "CSV"
          }), /* @__PURE__ */ jsx(Tab, {
            children: "Parsed"
          })]
        }), /* @__PURE__ */ jsxs(TabPanels, {
          children: [/* @__PURE__ */ jsx(TabPanel, {
            children: /* @__PURE__ */ jsxs(FormControl, {
              children: [/* @__PURE__ */ jsx(FormLabel, {
                children: "Comma, Space, or Semicolon Separated ETH or ENS Addresses:"
              }), /* @__PURE__ */ jsx(Textarea, {
                height: 64,
                placeholder: "Enter space, semicolon, or comma separated eth addresses.",
                value: raw,
                onChange: ({
                  target: {
                    value
                  }
                }) => {
                  setRaw(value);
                }
              })]
            })
          }), /* @__PURE__ */ jsx(TabPanel, {
            children: /* @__PURE__ */ jsx(OrderedList, {
              children: addresses.map((addr, idx) => /* @__PURE__ */ jsx(ListItem, {
                justifyContent: "center",
                children: addr
              }, idx))
            })
          })]
        })]
      }), /* @__PURE__ */ jsx(FormControl, {
        children: /* @__PURE__ */ jsxs(RadioGroup, {
          onChange: setAction,
          value: action,
          children: [/* @__PURE__ */ jsx(Radio, {
            value: "mint",
            children: "Mint"
          }), /* @__PURE__ */ jsx(Radio, {
            value: "whitelist",
            ml: 5,
            children: "Whitelist"
          })]
        })
      }), /* @__PURE__ */ jsx(FormControl, {
        children: /* @__PURE__ */ jsx(Checkbox, {
          name: "skip",
          value: "true",
          children: "Skip existing holders"
        })
      }), /* @__PURE__ */ jsx(FormControl, {
        textAlign: "center",
        children: !rwContract ? /* @__PURE__ */ jsx(Button, {
          onClick: connect,
          children: "Connect"
        }) : /* @__PURE__ */ jsx(Button, {
          type: "submit",
          colorScheme: "green",
          children: "Distribute"
        })
      })]
    })]
  });
};
export {
  Disburse as default
};
//# sourceMappingURL=disburse.9453a40d.js.map
