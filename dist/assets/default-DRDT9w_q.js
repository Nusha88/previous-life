import{s as u,o as c,c as m,r as d,p as f,m as _,g as p,u as v,a as y,b as t,d as B,e as w,f as k,w as S}from"./index-CLPH6ZXT.js";import{m as b,a as g,u as M}from"./tag-BFRVca9H.js";function V(){const e=u(!1);return c(()=>{window.requestAnimationFrame(()=>{e.value=!0})}),{ssrBootStyles:m(()=>e.value?void 0:{transition:"none !important"}),isBooted:d(e)}}const C=f({scrollable:Boolean,..._(),...g(),...b({tag:"main"})},"VMain"),P=p()({name:"VMain",props:C(),setup(e,s){let{slots:a}=s;const{dimensionStyles:o}=M(e),{mainStyles:r}=v(),{ssrBootStyles:i}=V();return y(()=>t(e.tag,{class:["v-main",{"v-main--scrollable":e.scrollable},e.class],style:[r.value,i.value,o.value,e.style]},{default:()=>{var n,l;return[e.scrollable?t("div",{class:"v-main__scroller"},[(n=a.default)==null?void 0:n.call(a)]):(l=a.default)==null?void 0:l.call(a)]}})),{}}}),D={__name:"default",setup(e){return(s,a)=>{const o=w("router-view");return k(),B(P,null,{default:S(()=>[t(o)]),_:1})}}};export{D as default};
