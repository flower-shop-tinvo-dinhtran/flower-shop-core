import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('list')
  async getProductList(@Req() req: Request, @Res() res: Response) {
    return await this.productService.getProductList(req, res);
  }

  @Post()
  async createProduct(@Req() req: Request, @Res() res: Response) {
    return await this.productService.createProduct(req, res);
  }
}
