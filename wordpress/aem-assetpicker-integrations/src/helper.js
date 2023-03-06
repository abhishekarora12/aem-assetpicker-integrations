/* Handle Fetch Errors */
function handleFetchErrors(response) {
    if (!response.ok) throw Error(response.statusText);
    return response;
}