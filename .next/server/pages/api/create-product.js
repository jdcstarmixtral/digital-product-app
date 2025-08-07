"use strict";(()=>{var e={};e.id=203,e.ids=[203],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},7147:e=>{e.exports=require("fs")},1017:e=>{e.exports=require("path")},362:(e,r,t)=>{t.r(r),t.d(r,{config:()=>m,default:()=>p,routeModule:()=>f});var a={};t.r(a),t.d(a,{default:()=>handler});var s=t(1802),o=t(7153),n=t(6249),l=t(7147),i=t.n(l),d=t(1017),u=t.n(d);let c=u().join(process.cwd(),"pages/products/");function handler(e,r){if("POST"!==e.method)return r.status(405).json({error:"Only POST allowed"});try{let{slug:t,title:a,description:s,image:o,price:n}=e.body;if(!t||!a||!s||!o||!n)return r.status(400).json({error:"Missing required fields"});(function(e){let{slug:r,title:t,description:a,image:s,price:o}=e,n=`
import Head from 'next/head';

export default function ${r.replace(/-/g,"_")}() {
  return (
    <>
      <Head>
        <title>${t}</title>
      </Head>
      <main className="p-10">
        <h1 className="text-4xl font-bold">${t}</h1>
        <img src="/images/${s}" alt="${t}" className="my-4 rounded-xl" />
        <p className="text-lg">${a}</p>
        <p className="text-xl font-bold mt-4">Only $${o}</p>
      </main>
    </>
  );
}
  `.trim(),l=u().join(c,`${r}.tsx`);i().writeFileSync(l,n,"utf8"),console.log(`✅ Created product: ${r}`)})({slug:t,title:a,description:s,image:o,price:n}),r.status(200).json({success:!0,message:`Product '${t}' created.`})}catch(e){console.error("❌ Error:",e),r.status(500).json({error:"Internal Server Error"})}}let p=(0,n.l)(a,"default"),m=(0,n.l)(a,"config"),f=new s.PagesAPIRouteModule({definition:{kind:o.x.PAGES_API,page:"/api/create-product",pathname:"/api/create-product",bundlePath:"",filename:""},userland:a})}};var r=require("../../webpack-api-runtime.js");r.C(e);var __webpack_exec__=e=>r(r.s=e),t=r.X(0,[222],()=>__webpack_exec__(362));module.exports=t})();