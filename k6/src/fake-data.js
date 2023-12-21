import { faker } from '@faker-js/faker';

export const generateSubscriber = () => ({
    sku: faker.string.uuid(),
    description: faker.string.uuid(),
    price: faker.number.float(),
    stock: faker.number.int()
});