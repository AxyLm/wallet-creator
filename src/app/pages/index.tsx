import { Button } from '@/app/components/ui/button'
import * as bip39 from 'bip39'
import { ethers } from 'ethers'
import { arrayify, concat, hexDataSlice, keccak256 } from 'ethers/lib/utils'
;('use client')

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
import { Input } from '@/app/components/ui/input'
import { toast } from '@/app/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import MnemonicGeneration from '@/app/pages/mnemonic-generation'
const FormSchema = z.object({
  entropy: z.string().min(2, {
    message: '',
  }),
  length: z.enum(['12', '24']),
})

function Main() {
  const [seed, setSeed] = useState<string>('')
  const [mnemonic, setMnemonic] = useState<string[]>()

  function generationMnemonic() {
    return generation(12, seed)
  }
  function generation(length: 12 | 24, seed: string = '') {
    const map = {
      12: 16,
      24: 32,
    }
    const entropyBytes = ethers.utils.randomBytes(16)

    const extraEntropy = (() => {
      if (seed) {
        return Buffer.from(seed)
      }
      return Buffer.from(ethers.Wallet.createRandom().privateKey.slice(2))
    })()

    const entropy = arrayify(hexDataSlice(keccak256(concat([entropyBytes, extraEntropy])), 0, map[length]))
    const mnemonic = bip39.entropyToMnemonic(Buffer.from(entropy)).split(' ')
    setMnemonic(mnemonic)
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      entropy: '',
      length: '12',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    generation(Number(data.length) as 12 | 24, data.entropy)
  }

  return (
    <>
    <div className='flex items-center justify-center mt-12'>

      <MnemonicGeneration />
    </div>

      {/* <div className="flex h-screen gap-2 p-4">
        <div className="flex-none border mnemonic-history border-base-1 w-52"></div>

        <div className="flex-auto border border-base-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
              <FormField
                control={form.control}
                name="entropy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entropy</FormLabel>
                    <FormControl>
                      <Input placeholder="Entropy" {...field} />
                    </FormControl>
                    <FormDescription>This is your extra entropy.</FormDescription>
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
                    <FormDescription>This is your Mnemonic Length.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Generation</Button>
            </form>
          </Form>
          <div>
            <p>Mnemonic</p>
            <div>
              {mnemonic?.map((word, index) => (
                <span key={index}>{word} </span>
              ))}
            </div>
          </div>
        </div>
      </div> */}
    </>
  )
}

export default Main
