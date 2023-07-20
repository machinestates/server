const UserProfile = require('./user-profile');

describe('getProfileByHandle()', () => {
  test('should retrieve profile for a user', async () => {
    const handle = 'ease';

    /**jest
    .spyOn(UserCoin, 'findAll')
    .mockImplementationOnce(() => {
      return coins;
    });**/

    const result = await UserProfile.getByHandle(handle);
    expect(result.profile.username).toBe('ease');
  });
});