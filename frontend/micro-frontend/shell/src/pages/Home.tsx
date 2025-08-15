import { Badge } from '@hotel-inventory/shared-lib/components'

export default function Home() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Welcome</h2>
      <p className="text-gray-600">
        Use the navigation to access each micro-frontend. The shell runs on port 3005 and embeds each
        service via iframe while you develop them independently with Vite.
      </p>
      <div className="flex gap-2">
        <Badge variant="primary">Admin @ 3001</Badge>
        <Badge variant="success">Frontdesk @ 3003</Badge>
        <Badge variant="warning">Inspector @ 3004</Badge>
        <Badge variant="info">Users @ 3000</Badge>
      </div>
    </div>
  )
}
