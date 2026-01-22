export const errorMessage = (error) => {
    const message = error?.message || error?.response?.data?.message || 'Something went wrong';
    console.log(message);
    return message;
}