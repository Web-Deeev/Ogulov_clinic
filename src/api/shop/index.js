import { productService } from './product';
import { orderService } from './order';
import { userService } from './user';

const shopService = {
  ...productService,
  ...orderService,
  ...userService,
};

export default shopService;
