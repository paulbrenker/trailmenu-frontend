import { Injectable } from '@angular/core'
import axios, { AxiosError, AxiosInstance } from 'axios'
import { ErrorResponse } from '../models/error-response.model'
import { getTokenFromLocalStorage } from '../util/token.helper'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  LIMIT = 20 // default limit for paginated requests
  API_BASE_URL = 'https://api.pbrenk.com'

  readonly axiosClient: AxiosInstance

  constructor() {
    this.axiosClient = axios.create({
      baseURL: this.API_BASE_URL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.axiosClient.interceptors.request.use(
      config => {
        const token = getTokenFromLocalStorage()
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
      },
      async error => Promise.reject(error)
    )

    this.axiosClient.interceptors.response.use(
      response => response,
      async (error: AxiosError<ErrorResponse>) => {
        if (error.response?.data) {
          const apiError: ErrorResponse = {
            status: error.response.data.status,
            code: error.response.data.code,
            message: error.response.data.message,
            target: error.response.data.target
          }
          return Promise.reject(apiError)
        }
      }
    )
  }
}
