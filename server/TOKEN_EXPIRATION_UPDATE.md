# JWT Token Expiration Update

## ✅ Changes Applied

### Access Token Expiration
- **Before**: 7 days (`7d`)
- **After**: 1 day (`1d`)

### Refresh Token Expiration
- **Before**: 30 days (`30d`)
- **After**: 7 days (`7d`)

## 📝 Files Modified

1. **`server/src/config/env.ts`**:
   - Changed default `expiresIn` from `'7d'` to `'1d'`
   - Changed default `refreshExpiresIn` from `'30d'` to `'7d'`

2. **`server/.env`**:
   - Updated `JWT_EXPIRES_IN=1d`
   - Updated `JWT_REFRESH_EXPIRES_IN=7d`

3. **`server/.env.example`**:
   - Updated example values to match new defaults

4. **`server/src/services/auth.service.ts`**:
   - Fixed refresh token database expiration calculation to dynamically parse the config value
   - Now properly calculates expiration based on `refreshExpiresIn` config (supports `d` for days, `h` for hours)

## 🔄 How It Works

- **Access Token**: Expires after 1 day. Users will need to refresh their token daily.
- **Refresh Token**: Expires after 7 days. Users can use this to get a new access token without logging in again.

## 🚀 Next Steps

1. **Restart the server** for changes to take effect:
   ```powershell
   cd server
   npm run dev
   ```

2. **Existing tokens**: Users with existing tokens will need to log in again after their current tokens expire.

3. **Testing**: After restarting, new logins will generate tokens with the new expiration times.

## 📌 Notes

- The access token expiration is now set to 1 day as requested
- Refresh tokens are set to 7 days to balance security and user experience
- The refresh token database expiration now dynamically matches the JWT expiration config
