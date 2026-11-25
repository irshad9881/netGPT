export const toStoreUser = (user) => ({
  uid: user.id,
  email: user.email,
  displayName: user.name,
  photoURL: user.photoUrl || "",
});
