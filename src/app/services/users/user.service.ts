import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export async function getToken(
  username: string,
  password: string
): Promise<string> {
  return axios
    .post('https://api.pbrenk.com/user/token', {
      username: username,
      password: password,
    })
    .then((response: { data: { token: string } }) => response.data.token);
}

type DecodedToken = {
  roles?: string[];
  [key: string]: unknown;
};

export function isOfRole(role: string): boolean {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.roles?.includes(role) ?? false;
  } catch (e) {
    return false;
  }
}

export async function getAllUsers(): Promise<any[]> {
  return Promise.resolve([]);
}
