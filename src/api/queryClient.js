import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2,
    },
  },
})


// Query keys | Para identificar las queries y poder invalidarlas o refetcharlas
export const queryKeys = {
  users: ['users'],
  roles: ['roles'],
  establishments: ['establishments'],
  myEstablishments: ['my-establishments'],
  establishmentStates: ['establishment-states'],
  provinces: ['provinces'],
  districts: (provinceId) => ['districts', provinceId],
}

export default queryClient