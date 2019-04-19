import axios from "axios";

export const baseURL = "https://sans-stitches.herokuapp.com/api/v1";

export default axios.create({ baseURL });
