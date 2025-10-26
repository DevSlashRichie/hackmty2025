import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/gamification')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/gamification"!</div>
}
