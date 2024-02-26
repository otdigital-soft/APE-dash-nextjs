import { FileManager } from '@/components/file-manager'

export default function DrivePage() {
  return (
    <main className="mt-5 flex flex-col">
      <h1 className="block lg:hidden text-3xl mb-5">My Drive</h1>
      <FileManager />
    </main>
  )
}
