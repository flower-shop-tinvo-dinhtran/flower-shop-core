import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { APIResponse, toQueryParams } from 'src/utils/APIResponse';
import { Product } from './schemas/product.schemas';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: mongoose.Model<Product>,
  ) {}

  async getProductList(req: Request, res: Response) {
    const queryParams = toQueryParams(req.query);

    const products = await this.productModel.find(
      {
        ...queryParams.q,
        name: { $regex: queryParams.search, $options: 'i' },
        slug: { $regex: queryParams.search, $options: 'i' },
      },
      null,
      {
        skip: queryParams.offset,
        limit: queryParams.limit,
      },
    );

    let total = undefined;

    if (queryParams.getTotal) {
      total = await this.productModel.countDocuments({
        ...queryParams.q,
        name: { $regex: queryParams.search, $options: 'i' },
        slug: { $regex: queryParams.search, $options: 'i' },
      });
    }

    if (!products.length) {
      return APIResponse(res, {
        status: HttpStatus.NOT_FOUND,
        message: 'No products found',
        data: [],
      });
    }

    return APIResponse(res, {
      status: HttpStatus.OK,
      message: 'Product list fetched successfully',
      data: products,
      total,
    });
  }

  async createProduct(req: Request, res: Response) {
    const product = req.body;

    // required name, slug, price
    if (!product.name || !product.slug || !product.price) {
      return APIResponse(res, {
        status: HttpStatus.BAD_REQUEST,
        message: 'Required product name, slug, price',
        data: [],
      });
    }

    // check if product slug already exists
    const [slugCheck, nameCheck] = await Promise.all([
      this.productModel.findOne({
        slug: product.slug,
      }),
      this.productModel.findOne({
        slug: product.name,
      }),
    ]);

    if (slugCheck?.id) {
      return APIResponse(res, {
        status: HttpStatus.BAD_REQUEST,
        message: 'Product slug already exists',
        data: [],
      });
    }

    if (nameCheck?.id) {
      return APIResponse(res, {
        status: HttpStatus.BAD_REQUEST,
        message: 'Product name already exists',
        data: [],
      });
    }

    // passed check, create new product
    const newProduct = await this.productModel.create(product);
    return APIResponse(res, {
      status: HttpStatus.OK,
      message: 'Product created successfully',
      data: [newProduct],
    });
  }
}
