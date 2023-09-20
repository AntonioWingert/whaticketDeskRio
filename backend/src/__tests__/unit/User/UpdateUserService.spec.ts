import faker from "faker";
import AppError from "../../../errors/AppError";
import CreateUserService from "../../../services/UserServices/CreateUserService";
import UpdateUserService from "../../../services/UserServices/UpdateUserService";
import { disconnect, truncate } from "../../utils/database";

describe("User", () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(async () => {
    await truncate();
  });

  afterAll(async () => {
    await disconnect();
  });

  it("should be able to find a user", async () => {
    const newUser = await CreateUserService({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      profileImage: faker.image.imageUrl(),
      userStatus: 1
    });

    const updatedUser = await UpdateUserService({
      userId: newUser.id,
      userData: {
        name: "New name",
        email: "newmail@email.com"
      },
      profileImage: faker.image.imageUrl()
    });

    expect(updatedUser).toHaveProperty("name", "New name");
    expect(updatedUser).toHaveProperty("email", "newmail@email.com");
  });

  it("should not be able to updated a inexisting user", async () => {
    const userId = faker.random.number();
    const userData = {
      name: faker.name.findName(),
      email: faker.internet.email()
    };
    const profileImage = faker.image.imageUrl();

    expect(
      UpdateUserService({ userId, userData, profileImage })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to updated an user with invalid data", async () => {
    const newUser = await CreateUserService({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      profileImage: faker.image.imageUrl(),
      userStatus: 1
    });

    const userId = newUser.id;
    const userData = {
      name: faker.name.findName(),
      email: "test.worgn.email"
    };
    const profileImage = faker.image.imageUrl();

    expect(
      UpdateUserService({ userId, userData, profileImage })
    ).rejects.toBeInstanceOf(AppError);
  });
});
