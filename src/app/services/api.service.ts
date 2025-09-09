import { Injectable } from '@angular/core'
import axios, { AxiosInstance } from 'axios'

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
        const token = localStorage.getItem('token')
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
      },
      async error => Promise.reject(error)
    )

    this.axiosClient.interceptors.response.use(
      response => response,
      async error => {
        console.error('API error:', error)
        return Promise.reject(error)
      }
    )
  }
}
