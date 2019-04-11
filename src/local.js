/**
 * @description function for checking if app data is stored in local storage
 * @param {object} localStorage localStorage object (to be mocked for testing)
 * @returns {boolean} value showing if app data is stored in local storage
 */
export const checkLocalStorage = localStorage => !!localStorage.sansStitches;

/**
 * @description function for getting details from app data stored in local storage
 * @param {string} detail key value for detail requested
 * @param {object} localStorage localStorage object (to be mocked for testing)
 * @returns {undefined} app detail requested
 */
export const getDetailsFromLocalStorage = (detail, localStorage) => {
  const localStorageDetails = JSON.parse(localStorage.sansStitches);
  return localStorageDetails[detail];
};

/**
 * @description function for adding details to app data stored in local storage
 * @param {object} detail object containing the key and value data of the detail
 * @param {object} localStorage localStorage object (to be mocked for testing)
 * @returns {undefined}
 */
export const addDetailsToLocalStorage = (detail, localStorage) => {
  const jsonLocalStorageDetails = localStorage.sansStitches;
  const localStorageDetails = jsonLocalStorageDetails
    ? JSON.parse(localStorage.sansStitches)
    : {};
  localStorage.sansStitches = JSON.stringify({
    ...localStorageDetails,
    ...detail
  });
};

/**
 * @description function for removing app data stored in local storage
 * @param {object} localStorage localStorage object (to be mocked for testing)
 * @returns {undefined}
 */
export const removeDetailsFromLocalStorage = localStorage => {
  delete localStorage.sansStitches;
};
