"use strict";(self.webpackChunk_chievemints_ui=self.webpackChunk_chievemints_ui||[]).push([[763],{8763:(e,t,n)=>{n.r(t),n.d(t,{default:()=>d});var a=n(2784),i=n(60146),r=n(18813),l=n(14738),s=n(18671),c=n(62833),o=n(10289),u=n(96111),m=n.n(u),h=n(23244),f=n(64033),g=n(33541),E=n(26106);const d=()=>{const[e,t]=(0,a.useState)([]),[n]=(0,c.lr)(),[u,d]=(0,a.useState)(Number(n.get("limit")??h.ce.limit)),[w,b]=(0,a.useState)(Number(n.get("offset")??h.ce.offset)),[p,x]=(0,a.useState)("true"===n.get("gating")),S=n.get("visible")??h.ce.visible,[y,k]=(0,a.useState)((0,i.XR)(S)),v=(0,o.s0)(),{roContract:C,constsContract:B}=(0,l.$6)(),I=(0,a.useCallback)(((e,n)=>{let a;return t((t=>(a={...t[e],...n},[...t.slice(0,e),...Array.from({length:e-t.length},(()=>({}))),a,...t.slice(e+1)]))),a}),[t]),[N,W]=(0,a.useState)(null),[_,A]=(0,a.useState)(null),[T,$]=(0,a.useState)(null),[O,P]=(0,a.useState)(null);(0,a.useEffect)((()=>{const e={};y?.length>0?Object.assign(e,{visible:y.toString()}):Object.entries({limit:u,offset:w,gating:p}).forEach((([t,n])=>{n!==h.ce[t]&&Object.assign(e,{[t]:n.toString()})}));const t={search:`?${(0,c.fW)(e)}`};v(t,{replace:!0})}),[y,u,w,p,v]),(0,a.useEffect)((()=>{C&&B&&(C.typeSupply().then((e=>e.toBigInt())).then(W),B.GATING_TYPE().then((e=>e.toBigInt())).then(A),B.TYPE_WIDTH().then($),B.TYPE_BOUNDARY().then(P))}),[C,B]),(0,a.useEffect)((()=>{k((0,i.XR)(S))}),[S]);const R=(0,a.useCallback)((async({index:e,idx:t,hideable:n=!0})=>{if(null==T||null==O)return null;try{const a=(await C.tokenByIndex(e)).toBigInt(),i=(a&2n**BigInt(T)-1n<<BigInt(O))===_,r={gating:i,hidden:n&&i&&!p};return I(t,{id:`0x${a.toString(16)}`,is:r,index:e})}catch(e){return I(t,{error:(0,i.B9)(e)})}}),[_,O,T,p,C,I]),j=(0,a.useRef)(null),G=(0,a.useCallback)((async e=>(j.current?.abort(),j.current=new AbortController,await Promise.allSettled(e.map((async(e,t)=>{if(!(e instanceof Error)){if(e.is?.hidden)throw new Error("Token is hidden.");try{const n=await C.uri(e.id);if(""===n)throw new Error("No URI… Waiting for configuration…");I(t,{uri:n});const a=await fetch((0,i._m)(n),{signal:j.current.signal});if(!a.ok)throw new Error(`Request Status: ${a.status}`);const r=await a.text();if(!r||""===r.trim())throw new Error("Aww, No Data. 😾");I(t,{metadata:m().parse(r)}),C.totalSupply(e.id).then((e=>I(t,{total:e}))),C.getMax(e.id).then((e=>I(t,{max:e})))}catch(e){if(!(e instanceof DOMException))return I(t,{error:(0,i.B9)(e)})}}}))))),[C,I]);return(0,a.useEffect)((()=>{(async()=>{if(C&&B&&null!=N){const e=[];if(t([]),y.some((()=>!0))){let t=0;e.push(...y.map((async e=>{let{high:n,low:a}=e,i=[n,a];return i=i.sort(),[a,n]=i,i.some((e=>null!=e))||([n,a]=[e,e]),await Promise.all(Array.from({length:n-a+1}).map((async(e,n)=>await R({index:a+n,idx:t++,hideable:!1}))))})))}else{const t=w<0?Number(N)+w:w,n=Math.min(u,Number(N)-t);e.push(...Array.from({length:n}).map((async(e,n)=>await R({index:t+n+1,idx:n}))))}const n=(await Promise.all(e)).flat();await G(n)}})()}),[y,G,C,B,u,w,R,N]),a.createElement(f.W2,{maxW:"full"},a.createElement(s.q,null,a.createElement("title",null,"𝔐𝔢𝔱𝔞𝔊𝔞𝔪𝔢’𝔰 ’𝘾𝙝𝙞𝙚𝙫𝙚𝙢𝙞𝙣𝙩𝙨"),a.createElement("meta",{name:"description",content:"MetaGame’s ’Chievemint NFTs"})),a.createElement(g.m$.header,{h:"45vh"},a.createElement(f.kC,{maxW:"40rem",margin:"auto"},a.createElement(r.h4,{mt:"5vh",h:"40vh"}))),a.createElement(g.m$.main,null,a.createElement(f.Kq,{align:"center"},a.createElement(r.$B,{flexGrow:1,limit:u,setLimit:d,offset:w,setOffset:b,gatingVisible:p,setGatingVisible:x,visibleList:y,setVisibleList:k}),a.createElement(r.jq,{tokens:e}),a.createElement(f.kC,{justify:"center"},a.createElement(E.zx,{onClick:()=>{if(y.length>0){const e=y.map((e=>e?.high??e)),t=Math.max(...e);k((e=>[...e,{low:t,high:t+10}]))}else d((e=>e+10))}},a.createElement(f.xv,{as:"span",mr:1,mt:-.5,fontSize:"150%",fontWeight:"bold"},"+"),"10"),a.createElement(E.zx,{ml:5,onClick:()=>b((e=>e+u))},a.createElement(f.xv,{as:"span",mr:.75,mt:-1,fontSize:"200%",fontWeight:"bold"},"↓"),u)))))}}}]);