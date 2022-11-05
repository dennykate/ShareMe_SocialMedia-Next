export const fetchUser = () => {
  const userInfo =
    localStorage.getItem("user") != "undefied"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  return userInfo;
};
