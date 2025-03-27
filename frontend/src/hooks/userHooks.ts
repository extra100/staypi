import { useMutation, useQuery } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { User } from '../types/User'
import { UserInfo } from '../types/UserInfo'

export const useUserDataQuery = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: async () => (await apiClient.get<UserInfo[]>(`/api/users`)).data,
  })

export const useSigninMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      password,
      id_outlet,
    }: {
      email: string
      password: string
      id_outlet: string
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/signin`, {
          email,
          password,
          id_outlet,
        })
      ).data,
  })
export const useSignupMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
      id_outlet,
    }: {
      name: string
      email: string
      password: string
      id_outlet: string
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/signup`, {
          name,
          email,
          password,
          id_outlet,
        })
      ).data,
  })

export const useUpdateProfileMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
      id_outlet,
    }: {
      name: string
      email: string
      password: string
      id_outlet: string
    }) =>
      (
        await apiClient.put<UserInfo>(`api/users/profile`, {
          name,
          email,
          password,
          id_outlet,
        })
      ).data,
  })
