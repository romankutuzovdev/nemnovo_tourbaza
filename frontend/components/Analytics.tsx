import Script from 'next/script'

const YM_ID = 108238763

/** Временно выключено — поставьте `true`, чтобы включить счётчики. */
const ENABLE_GOOGLE_ANALYTICS = true
const ENABLE_YANDEX_METRIKA = true

/** GA4 + Яндекс.Метрика (по флагам выше). */
export function Analytics() {
  const GA_ID = 'G-EF2LFNVKGV'

  if (!ENABLE_GOOGLE_ANALYTICS && !ENABLE_YANDEX_METRIKA) {
    return null
  }

  return (
    <>
      {ENABLE_GOOGLE_ANALYTICS ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      ) : null}

      {ENABLE_YANDEX_METRIKA ? (
        <>
          <Script id="yandex-metrika-script" strategy="afterInteractive">
            {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r)return}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');if(typeof window.ym==='function'){window.ym(${YM_ID},'init',{ssr:true,clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});}`}
          </Script>
        </>
      ) : null}
    </>
  )
}
