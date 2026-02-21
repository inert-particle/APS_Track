const getflightGoCodes = async () => {
    try {
        const response = await fetch("/api/flightGoCodes");
        const data = await response.json();
        return JSON.stringify(data);
    } catch (error) {
        return JSON.stringify("Error fetching data");
    }
}