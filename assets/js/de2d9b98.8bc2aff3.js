"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5363],{3905:function(e,t,r){r.d(t,{Zo:function(){return v},kt:function(){return s}});var l=r(7294);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);t&&(l=l.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,l)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,l,i=function(e,t){if(null==e)return{};var r,l,i={},n=Object.keys(e);for(l=0;l<n.length;l++)r=n[l],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(l=0;l<n.length;l++)r=n[l],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var d=l.createContext({}),u=function(e){var t=l.useContext(d),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},v=function(e){var t=u(e.components);return l.createElement(d.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return l.createElement(l.Fragment,{},t)}},p=l.forwardRef((function(e,t){var r=e.components,i=e.mdxType,n=e.originalType,d=e.parentName,v=o(e,["components","mdxType","originalType","parentName"]),p=u(r),s=i,f=p["".concat(d,".").concat(s)]||p[s]||c[s]||n;return r?l.createElement(f,a(a({ref:t},v),{},{components:r})):l.createElement(f,a({ref:t},v))}));function s(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var n=r.length,a=new Array(n);a[0]=p;var o={};for(var d in t)hasOwnProperty.call(t,d)&&(o[d]=t[d]);o.originalType=e,o.mdxType="string"==typeof e?e:i,a[1]=o;for(var u=2;u<n;u++)a[u]=r[u];return l.createElement.apply(null,a)}return l.createElement.apply(null,r)}p.displayName="MDXCreateElement"},8998:function(e,t,r){r.r(t),r.d(t,{assets:function(){return v},contentTitle:function(){return d},default:function(){return s},frontMatter:function(){return o},metadata:function(){return u},toc:function(){return c}});var l=r(7462),i=r(3366),n=(r(7294),r(3905)),a=["components"],o={id:"refactor",title:"\u91cd\u6784",sidebar_position:4,tags:["\u8f6f\u4ef6\u5b9e\u73b0"]},d=void 0,u={unversionedId:"softwaremaster/develop/development/implementation/refactor",id:"softwaremaster/develop/development/implementation/refactor",title:"\u91cd\u6784",description:"\uff08\u5f85\u8865\u5145\uff09",source:"@site/docs/softwaremaster/develop/development/implementation/refactor.md",sourceDirName:"softwaremaster/develop/development/implementation",slug:"/softwaremaster/develop/development/implementation/refactor",permalink:"/docs/softwaremaster/develop/development/implementation/refactor",tags:[{label:"\u8f6f\u4ef6\u5b9e\u73b0",permalink:"/docs/tags/\u8f6f\u4ef6\u5b9e\u73b0"}],version:"current",sidebarPosition:4,frontMatter:{id:"refactor",title:"\u91cd\u6784",sidebar_position:4,tags:["\u8f6f\u4ef6\u5b9e\u73b0"]},sidebar:"softwaremaster",previous:{title:"\u8f6f\u4ef6\u5b9e\u73b0",permalink:"/docs/softwaremaster/develop/development/implementation/"},next:{title:"\u8f6f\u4ef6\u9a8c\u8bc1",permalink:"/docs/softwaremaster/develop/development/verification/"}},v={},c=[{value:"3.1. \u4ee3\u7801\u574f\u5473\u9053",id:"31-\u4ee3\u7801\u574f\u5473\u9053",level:2},{value:"3.1.1. \u91cd\u590d\u4ee3\u7801",id:"311-\u91cd\u590d\u4ee3\u7801",level:3},{value:"3.1.2. \u8fc7\u957f\u51fd\u6570",id:"312-\u8fc7\u957f\u51fd\u6570",level:3},{value:"3.1.3. \u8fc7\u5927\u7684\u7c7b",id:"313-\u8fc7\u5927\u7684\u7c7b",level:3},{value:"3.1.4. \u8fc7\u957f\u53c2\u6570\u5217",id:"314-\u8fc7\u957f\u53c2\u6570\u5217",level:3},{value:"3.1.5. \u53d1\u6563\u5f0f\u53d8\u5316",id:"315-\u53d1\u6563\u5f0f\u53d8\u5316",level:3},{value:"3.1.6. \u6563\u5f39\u5f0f\u4fee\u6539",id:"316-\u6563\u5f39\u5f0f\u4fee\u6539",level:3},{value:"3.1.7. \u4f9d\u604b\u60c5\u7ed3",id:"317-\u4f9d\u604b\u60c5\u7ed3",level:3},{value:"3.1.8. \u6570\u636e\u6ce5\u56e2",id:"318-\u6570\u636e\u6ce5\u56e2",level:3},{value:"3.1.9. \u57fa\u672c\u7c7b\u578b\u504f\u6267",id:"319-\u57fa\u672c\u7c7b\u578b\u504f\u6267",level:3},{value:"3.1.10. switch\u60ca\u609a\u73b0\u8eab",id:"3110-switch\u60ca\u609a\u73b0\u8eab",level:3},{value:"3.1.11. \u5e73\u884c\u7ee7\u627f\u4f53\u7cfb",id:"3111-\u5e73\u884c\u7ee7\u627f\u4f53\u7cfb",level:3},{value:"3.1.12. \u5197\u8d58\u7c7b",id:"3112-\u5197\u8d58\u7c7b",level:3},{value:"3.1.13. \u5938\u5938\u5176\u8c08\u672a\u6765\u6027",id:"3113-\u5938\u5938\u5176\u8c08\u672a\u6765\u6027",level:3},{value:"3.1.14. \u4ee4\u4eba\u8ff7\u60d1\u7684\u6682\u65f6\u5b57\u6bb5",id:"3114-\u4ee4\u4eba\u8ff7\u60d1\u7684\u6682\u65f6\u5b57\u6bb5",level:3},{value:"3.1.15. \u8fc7\u5ea6\u8026\u5408\u7684\u6d88\u606f\u94fe",id:"3115-\u8fc7\u5ea6\u8026\u5408\u7684\u6d88\u606f\u94fe",level:3},{value:"3.1.16. \u4e2d\u95f4\u4eba",id:"3116-\u4e2d\u95f4\u4eba",level:3},{value:"3.1.17. \u72ce\u6635\u5173\u7cfb",id:"3117-\u72ce\u6635\u5173\u7cfb",level:3},{value:"3.1.18. \u5f02\u66f2\u540c\u5de5\u7684\u7c7b",id:"3118-\u5f02\u66f2\u540c\u5de5\u7684\u7c7b",level:3},{value:"3.1.19. \u4e0d\u5b8c\u7f8e\u7684\u5e93\u7c7b",id:"3119-\u4e0d\u5b8c\u7f8e\u7684\u5e93\u7c7b",level:3},{value:"3.1.20. \u7eaf\u7a1a\u7684\u6570\u636e\u7c7b",id:"3120-\u7eaf\u7a1a\u7684\u6570\u636e\u7c7b",level:3},{value:"3.1.21. \u88ab\u62d2\u7edd\u7684\u9057\u8d60",id:"3121-\u88ab\u62d2\u7edd\u7684\u9057\u8d60",level:3},{value:"3.1.22. \u8fc7\u591a\u7684\u6ce8\u91ca",id:"3122-\u8fc7\u591a\u7684\u6ce8\u91ca",level:3},{value:"4.1. \u6d4b\u8bd5\u9632\u62a4\u7f51",id:"41-\u6d4b\u8bd5\u9632\u62a4\u7f51",level:2},{value:"4.2. \u91cd\u6784\u624b\u6cd5",id:"42-\u91cd\u6784\u624b\u6cd5",level:2},{value:"4.2.1. \u91cd\u65b0\u7ec4\u7ec7\u51fd\u6570",id:"421-\u91cd\u65b0\u7ec4\u7ec7\u51fd\u6570",level:3},{value:"4.2.2. \u5728\u5bf9\u8c61\u4e4b\u95f4\u642c\u79fb\u7279\u6027",id:"422-\u5728\u5bf9\u8c61\u4e4b\u95f4\u642c\u79fb\u7279\u6027",level:3},{value:"4.2.3. \u91cd\u65b0\u7ec4\u7ec7\u6570\u636e",id:"423-\u91cd\u65b0\u7ec4\u7ec7\u6570\u636e",level:3},{value:"4.2.4. \u7b80\u5316\u6761\u4ef6\u8868\u8fbe\u5f0f",id:"424-\u7b80\u5316\u6761\u4ef6\u8868\u8fbe\u5f0f",level:3},{value:"4.2.5. \u7b80\u5316\u51fd\u6570\u8c03\u7528",id:"425-\u7b80\u5316\u51fd\u6570\u8c03\u7528",level:3},{value:"4.2.6. \u5904\u7406\u6982\u62ec\u5173\u7cfb",id:"426-\u5904\u7406\u6982\u62ec\u5173\u7cfb",level:3},{value:"4.2.7. \u5927\u578b\u91cd\u6784",id:"427-\u5927\u578b\u91cd\u6784",level:3},{value:"4.3. \u91cd\u6784\u5de5\u5177",id:"43-\u91cd\u6784\u5de5\u5177",level:2}],p={toc:c};function s(e){var t=e.components,r=(0,i.Z)(e,a);return(0,n.kt)("wrapper",(0,l.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"\uff08\u5f85\u8865\u5145\uff09"),(0,n.kt)("h1",{id:"1-\u91cd\u6784\u662f\u4ec0\u4e48"},"1. \u91cd\u6784\u662f\u4ec0\u4e48"),(0,n.kt)("p",null,"\u7b80\u5355\u8bf4\uff0c\u91cd\u6784\u5c31\u662f\u5728\u4e0d\u6539\u53d8\u4ee3\u7801\u5916\u5728\u884c\u4e3a\u7684\u524d\u63d0\u4e0b\uff0c\u5bf9\u4ee3\u7801\u8fdb\u884c\u4fee\u6539\uff0c\u4ee5\u6539\u8fdb\u7a0b\u5e8f\u7684\u5185\u90e8\u7ed3\u6784\uff0c\u6bd4\u5982\u83b7\u5f97\u66f4\u597d\u7684\u53ef\u8bfb\u6027\u3001\u53ef\u7ef4\u62a4\u6027\u3001\u53ef\u6269\u5c55\u6027\u7b49\u3002"),(0,n.kt)("h1",{id:"2-\u4e3a\u4ec0\u4e48\u5e94\u8be5\u91cd\u6784"},"2. \u4e3a\u4ec0\u4e48\u5e94\u8be5\u91cd\u6784"),(0,n.kt)("h1",{id:"3-\u5e94\u8be5\u5728\u4f55\u5904\u91cd\u6784"},"3. \u5e94\u8be5\u5728\u4f55\u5904\u91cd\u6784"),(0,n.kt)("h2",{id:"31-\u4ee3\u7801\u574f\u5473\u9053"},"3.1. \u4ee3\u7801\u574f\u5473\u9053"),(0,n.kt)("h3",{id:"311-\u91cd\u590d\u4ee3\u7801"},"3.1.1. \u91cd\u590d\u4ee3\u7801"),(0,n.kt)("h3",{id:"312-\u8fc7\u957f\u51fd\u6570"},"3.1.2. \u8fc7\u957f\u51fd\u6570"),(0,n.kt)("h3",{id:"313-\u8fc7\u5927\u7684\u7c7b"},"3.1.3. \u8fc7\u5927\u7684\u7c7b"),(0,n.kt)("h3",{id:"314-\u8fc7\u957f\u53c2\u6570\u5217"},"3.1.4. \u8fc7\u957f\u53c2\u6570\u5217"),(0,n.kt)("h3",{id:"315-\u53d1\u6563\u5f0f\u53d8\u5316"},"3.1.5. \u53d1\u6563\u5f0f\u53d8\u5316"),(0,n.kt)("h3",{id:"316-\u6563\u5f39\u5f0f\u4fee\u6539"},"3.1.6. \u6563\u5f39\u5f0f\u4fee\u6539"),(0,n.kt)("h3",{id:"317-\u4f9d\u604b\u60c5\u7ed3"},"3.1.7. \u4f9d\u604b\u60c5\u7ed3"),(0,n.kt)("h3",{id:"318-\u6570\u636e\u6ce5\u56e2"},"3.1.8. \u6570\u636e\u6ce5\u56e2"),(0,n.kt)("h3",{id:"319-\u57fa\u672c\u7c7b\u578b\u504f\u6267"},"3.1.9. \u57fa\u672c\u7c7b\u578b\u504f\u6267"),(0,n.kt)("h3",{id:"3110-switch\u60ca\u609a\u73b0\u8eab"},"3.1.10. switch\u60ca\u609a\u73b0\u8eab"),(0,n.kt)("h3",{id:"3111-\u5e73\u884c\u7ee7\u627f\u4f53\u7cfb"},"3.1.11. \u5e73\u884c\u7ee7\u627f\u4f53\u7cfb"),(0,n.kt)("h3",{id:"3112-\u5197\u8d58\u7c7b"},"3.1.12. \u5197\u8d58\u7c7b"),(0,n.kt)("h3",{id:"3113-\u5938\u5938\u5176\u8c08\u672a\u6765\u6027"},"3.1.13. \u5938\u5938\u5176\u8c08\u672a\u6765\u6027"),(0,n.kt)("h3",{id:"3114-\u4ee4\u4eba\u8ff7\u60d1\u7684\u6682\u65f6\u5b57\u6bb5"},"3.1.14. \u4ee4\u4eba\u8ff7\u60d1\u7684\u6682\u65f6\u5b57\u6bb5"),(0,n.kt)("h3",{id:"3115-\u8fc7\u5ea6\u8026\u5408\u7684\u6d88\u606f\u94fe"},"3.1.15. \u8fc7\u5ea6\u8026\u5408\u7684\u6d88\u606f\u94fe"),(0,n.kt)("h3",{id:"3116-\u4e2d\u95f4\u4eba"},"3.1.16. \u4e2d\u95f4\u4eba"),(0,n.kt)("h3",{id:"3117-\u72ce\u6635\u5173\u7cfb"},"3.1.17. \u72ce\u6635\u5173\u7cfb"),(0,n.kt)("h3",{id:"3118-\u5f02\u66f2\u540c\u5de5\u7684\u7c7b"},"3.1.18. \u5f02\u66f2\u540c\u5de5\u7684\u7c7b"),(0,n.kt)("h3",{id:"3119-\u4e0d\u5b8c\u7f8e\u7684\u5e93\u7c7b"},"3.1.19. \u4e0d\u5b8c\u7f8e\u7684\u5e93\u7c7b"),(0,n.kt)("h3",{id:"3120-\u7eaf\u7a1a\u7684\u6570\u636e\u7c7b"},"3.1.20. \u7eaf\u7a1a\u7684\u6570\u636e\u7c7b"),(0,n.kt)("h3",{id:"3121-\u88ab\u62d2\u7edd\u7684\u9057\u8d60"},"3.1.21. \u88ab\u62d2\u7edd\u7684\u9057\u8d60"),(0,n.kt)("h3",{id:"3122-\u8fc7\u591a\u7684\u6ce8\u91ca"},"3.1.22. \u8fc7\u591a\u7684\u6ce8\u91ca"),(0,n.kt)("h1",{id:"4-\u5982\u4f55\u8fdb\u884c\u91cd\u6784"},"4. \u5982\u4f55\u8fdb\u884c\u91cd\u6784"),(0,n.kt)("h2",{id:"41-\u6d4b\u8bd5\u9632\u62a4\u7f51"},"4.1. \u6d4b\u8bd5\u9632\u62a4\u7f51"),(0,n.kt)("h2",{id:"42-\u91cd\u6784\u624b\u6cd5"},"4.2. \u91cd\u6784\u624b\u6cd5"),(0,n.kt)("h3",{id:"421-\u91cd\u65b0\u7ec4\u7ec7\u51fd\u6570"},"4.2.1. \u91cd\u65b0\u7ec4\u7ec7\u51fd\u6570"),(0,n.kt)("h3",{id:"422-\u5728\u5bf9\u8c61\u4e4b\u95f4\u642c\u79fb\u7279\u6027"},"4.2.2. \u5728\u5bf9\u8c61\u4e4b\u95f4\u642c\u79fb\u7279\u6027"),(0,n.kt)("h3",{id:"423-\u91cd\u65b0\u7ec4\u7ec7\u6570\u636e"},"4.2.3. \u91cd\u65b0\u7ec4\u7ec7\u6570\u636e"),(0,n.kt)("h3",{id:"424-\u7b80\u5316\u6761\u4ef6\u8868\u8fbe\u5f0f"},"4.2.4. \u7b80\u5316\u6761\u4ef6\u8868\u8fbe\u5f0f"),(0,n.kt)("h3",{id:"425-\u7b80\u5316\u51fd\u6570\u8c03\u7528"},"4.2.5. \u7b80\u5316\u51fd\u6570\u8c03\u7528"),(0,n.kt)("h3",{id:"426-\u5904\u7406\u6982\u62ec\u5173\u7cfb"},"4.2.6. \u5904\u7406\u6982\u62ec\u5173\u7cfb"),(0,n.kt)("h3",{id:"427-\u5927\u578b\u91cd\u6784"},"4.2.7. \u5927\u578b\u91cd\u6784"),(0,n.kt)("h2",{id:"43-\u91cd\u6784\u5de5\u5177"},"4.3. \u91cd\u6784\u5de5\u5177"),(0,n.kt)("p",null,"\u3010",(0,n.kt)("a",{parentName:"p",href:"https://www.jetbrains.com/help/idea/refactoring-source-code.html"},"IntelliJ IDEA"),"\u3011 "),(0,n.kt)("h1",{id:"5-\u53c2\u8003\u8d44\u6599"},"5. \u53c2\u8003\u8d44\u6599"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://zh.wikipedia.org/wiki/%E4%BB%A3%E7%A0%81%E9%87%8D%E6%9E%84"},"\u8bcd\u6761\uff1a\u4ee3\u7801\u91cd\u6784")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://book.douban.com/subject/30468597/"},"\u300a\u91cd\u6784\uff1a\u6539\u5584\u65e2\u6709\u4ee3\u7801\u7684\u8bbe\u8ba1\u300b"))))}s.isMDXComponent=!0}}]);