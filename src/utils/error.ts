export function reject(error: string | { message: string }) {
  if (typeof error === 'string') {
    throw new Error(error);
  }
  throw new Error(error.message);
}
