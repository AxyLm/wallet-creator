import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Textarea } from '@/app/components/ui/textarea'
import QRCode from 'react-qr-code'

function Main() {
  const [str, setStr] = useState<string>('')
  return (
    <Card>
      <CardHeader>
        <CardTitle>QRCode Generate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-center mb-8">
          <div className="inline-block overflow-hidden">
            {str.length > 0 ? (
              <>
                <QRCode value={str} id="QRCode"/>
                <Button
                  className="w-full mt-4"
                  onClick={() => {
                    const svg = document.getElementById("QRCode");
                    console.log(svg);
                    if (svg) {
                      const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)))
                      const a = document.createElement('a')
                      const e = new MouseEvent('click')
                      a.download = 'QRCode.svg'
                      a.href = 'data:image/svg+xml;base64,' + base64doc
                      a.dispatchEvent(e)
                    }
                  }}
                >
                  Download
                </Button>
              </>
            ) : (
              <div className=" border-black-1 border-opacity-80 blur-sm">
                <QRCode value="hello world" />
              </div>
            )}
          </div>
        </div>
        <Textarea value={str} onChange={(e) => setStr(e.target.value)} />
      </CardContent>
    </Card>
  )
}

export default Main
