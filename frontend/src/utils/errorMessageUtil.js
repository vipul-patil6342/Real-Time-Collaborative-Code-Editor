export const errorMessage = (error) => {
    const message = error?.response?.data?.message || error?.response?.data?.error || error?.response?.data?.error?.message ||  error?.message || 'Something went wrong';
    console.log(error);
    return message;
}