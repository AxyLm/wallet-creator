import { Button } from '@/app/components/ui/button'
import * as bip39 from 'bip39'
import { ethers } from 'ethers'
import { arrayify, concat, hexDataSlice, keccak256 } from 'ethers/lib/utils'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import copy from 'copy-to-clipboard'
import { client, server } from '@passwordless-id/webauthn'

import { Task01Icon } from '@hugeicons/react-pro'
import { SVGProps } from 'react'

const map = {
  '12': 16,
  '24': 32,
} as const

type LengthType = keyof typeof map

const FormSchema = z.object({
  entropy: z.string(),
  length: z.enum(['12', '24']),
})

function EosIconsLoading(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
        opacity=".5"
      ></path>
      <path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
        <animateTransform
          attributeName="transform"
          dur="1s"
          from="0 12 12"
          repeatCount="indefinite"
          to="360 12 12"
          type="rotate"
        ></animateTransform>
      </path>
    </svg>
  )
}


function Main() {
  const [seed, setSeed] = useState<string>('')
  const [mnemonic, setMnemonic] = useState<string[]>()
  const [createLoading, setCreateLoading] = useState(false)

  async function generation(length: keyof typeof map, seed: string = '') {
    setMnemonic(undefined)
    setCreateLoading(true)
    await Promise.all([
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, Math.max(Math.random() * 1200, 500))
      }),
      new Promise<string[]>((resolve) => {
        const entropyBytes = ethers.utils.randomBytes(16)
        const extraEntropy = (() => {
          if (seed) {
            return Buffer.from(seed)
          }
          return Buffer.from(ethers.Wallet.createRandom().privateKey.slice(2))
        })()

        const entropy = arrayify(hexDataSlice(keccak256(concat([entropyBytes, extraEntropy])), 0, map[length]))
        const mnemonic = bip39.entropyToMnemonic(Buffer.from(entropy)).split(' ')
        resolve(mnemonic)
      }).then((e) => {
        setMnemonic(e)
      }),
    ]).finally(() => {
      setCreateLoading(false)
    })
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      entropy: '',
      length: '12',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setMnemonic(undefined)
    generation(data.length as LengthType, data.entropy)
  }

  const [entropyLoading, setEntropyLoading] = useState(false)
  async function generationEntropy() {
    setEntropyLoading(true)
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth')
    await provider
      .getBlockWithTransactions('latest')
      .then((block) => {
        form.setValue('entropy', block.hash.substring(2))
      })
      .finally(() => {
        setEntropyLoading(false)
      })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create wallet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
            <FormField
              control={form.control}
              name="entropy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entropy</FormLabel>
                  <FormControl>
                    <div className="flex items-center w-full space-x-2 ">
                      <Input placeholder="extra entropy" {...field} />
                      <Button variant="outline" type="button" onClick={generationEntropy} disabled={entropyLoading}>
                        <div className="inline-block w-4">
                          {entropyLoading ? (
                            <EosIconsLoading />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="16"
                              height="16"
                              color="#000000"
                              fill="none"
                            >
                              <path
                                d="M16.5 17.5L18 15.75H16.1407C15.0928 15.75 14.5688 15.75 14.1267 15.5281C13.6845 15.3063 13.3938 14.8976 12.8125 14.0801L9.85413 9.91987C9.27285 9.10244 8.9822 8.69372 8.54002 8.47186C8.09783 8.25 7.57386 8.25 6.52593 8.25H6M16.5 6.5L18 8.25H16.1407C15.0928 8.25 14.5688 8.25 14.1267 8.47186C13.6845 8.69372 13.3938 9.10244 12.8125 9.91987M6 15.75H6.52593C7.57386 15.75 8.09783 15.75 8.54001 15.5281C8.9822 15.3063 9.27285 14.8976 9.85413 14.0801"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
                                stroke="currentColor"
                                stroke-width="1.5"
                              />
                            </svg>
                          )}
                        </div>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={'12'}>12</SelectItem>
                        <SelectItem value={'24'}>24</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {/* <FormDescription>This is your Mnemonic Length.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4">
              <Button type="submit">
                <span>Create</span>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <div className="w-full p-1 overflow-hidden rounded-sm h-38">
          {createLoading ? (
            <div className="relative grid grid-cols-3 p-1 border rounded-sm border-black-1 border-opacity-45 border-1">
              {Array.from({ length: 12 }).map((_, index) => (
                <div className="flex p-2 border border-black-1 border-opacity-45 border-1 blur-sm" key={index}>
                  <div className="flex-none text-black select-none text-opacity-60">{index + 1}:&nbsp; </div>
                  <div className="flex-auto text-center">*****</div>
                </div>
              ))}

              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10">
                <EosIconsLoading />
              </div>
            </div>
          ) : (
            <>{mnemonic && mnemonic.length > 0 && <MnemonicGrid mnemonic={mnemonic} />}</>
          )}
        </div>
        {!createLoading && mnemonic && mnemonic.length > 0 && (
          <>
            <div className="w-full text-center h-38">
              <CopyMnemonic mnemonic={mnemonic} />
            </div>
          </>
        )}

        <hr className="w-full my-4" />
        <div className="text-left">
          <ul className="list-disc list-inside ">
            <li>
              <span>If I share my seed phrase with others, my assets will be stolen. </span>
              <span className="underline decoration-2 decoration-red-500">Never</span>&nbsp; share it with anyone.
            </li>
          </ul>
        </div>
      </CardFooter>
    </Card>
  )
}

function MnemonicGrid({ mnemonic }: { mnemonic: string[] }) {
  return (
    <div className="grid grid-cols-3 border rounded-sm border-black-1 border-opacity-45 border-1 ">
      {mnemonic?.map((word, index) => (
        <div className="flex p-2 border border-black-1 border-opacity-45 border-1" key={index}>
          <div className="flex-none text-black select-none text-opacity-60">{index + 1}:&nbsp; </div>
          <div className="flex-auto text-center">{word}</div>
        </div>
      ))}
    </div>
  )
}

function CopyMnemonic({ mnemonic }: { mnemonic: string[] }) {
  const [isCopy, setIsCopy] = useState(false)

  useEffect(() => {
    return () => {
      setIsCopy(false)
    }
  }, [mnemonic])
  return (
    <button
      className="inline-flex items-center justify-center gap-1 text-sm"
      onClick={() => {
        setIsCopy(true)
        copy(mnemonic.join(' '))
      }}
    >
      {isCopy ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={16}
          height={16}
          color={'#000000'}
          fill={'none'}
        >
          <path
            d="M7.5 3.5C5.9442 3.54667 5.01661 3.71984 4.37477 4.36227C3.49609 5.24177 3.49609 6.6573 3.49609 9.48836L3.49609 15.9944C3.49609 18.8255 3.49609 20.241 4.37477 21.1205C5.25345 22 6.66767 22 9.49609 22L14.4961 22C17.3245 22 18.7387 22 19.6174 21.1205C20.4961 20.241 20.4961 18.8255 20.4961 15.9944V9.48836C20.4961 6.6573 20.4961 5.24177 19.6174 4.36228C18.9756 3.71984 18.048 3.54667 16.4922 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M7.49609 3.75C7.49609 2.7835 8.2796 2 9.24609 2H14.7461C15.7126 2 16.4961 2.7835 16.4961 3.75C16.4961 4.7165 15.7126 5.5 14.7461 5.5H9.24609C8.2796 5.5 7.49609 4.7165 7.49609 3.75Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M13.5 11H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M7 12C7 12 7.5 12 8 13C8 13 9.58824 10.5 11 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M13.5 17H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 17H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={16}
          height={16}
          color={'#000000'}
          fill={'none'}
        >
          <path
            d="M7.99805 16H11.998M7.99805 11H15.998"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M7.5 3.5C5.9442 3.54667 5.01661 3.71984 4.37477 4.36227C3.49609 5.24177 3.49609 6.6573 3.49609 9.48836L3.49609 15.9944C3.49609 18.8255 3.49609 20.241 4.37477 21.1205C5.25345 22 6.66767 22 9.49609 22L14.4961 22C17.3245 22 18.7387 22 19.6174 21.1205C20.4961 20.241 20.4961 18.8255 20.4961 15.9944V9.48836C20.4961 6.6573 20.4961 5.24177 19.6174 4.36228C18.9756 3.71984 18.048 3.54667 16.4922 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M7.49609 3.75C7.49609 2.7835 8.2796 2 9.24609 2H14.7461C15.7126 2 16.4961 2.7835 16.4961 3.75C16.4961 4.7165 15.7126 5.5 14.7461 5.5H9.24609C8.2796 5.5 7.49609 4.7165 7.49609 3.75Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )}

      <span>copy</span>
    </button>
  )
}

export default Main
