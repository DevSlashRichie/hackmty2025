import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signup-alt')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/signup-alt"!</div>
}
