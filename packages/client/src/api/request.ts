import type { Http_Response } from "@chen/shared";
import axios, { type AxiosRequestConfig, type Method } from "axios";

export const baseURL = "http://localhost:3000"

export const request = axios.create({
    baseURL
})

export const httpRequest = <T>(url: string, method: Method, data?: any, config?: AxiosRequestConfig) => {
    return new Promise((resolve, reject) => {
        request({
            url,
            method,
            data: method === "get" || method === "GET" ? null : data,
            params: method === "get" || method === "GET" ? data : null,
            ...config
        })
            .then((res) => {
                resolve(res.data as Http_Response<T>)
            })
            .catch((err) => {
                reject(err)
                console.error(`axios error: ${err}`);
            })
    })
}

export const getRequest = <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return httpRequest<T>(url, "GET", data, config)
}

export const postRequest = <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return httpRequest<T>(url, "POST", data, config)
}

export const putRequest = <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return httpRequest<T>(url, "PUT", data, config)
}

export const deleteRequest = <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return httpRequest<T>(url, "DELETE", data, config)
}