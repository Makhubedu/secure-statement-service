import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../common/entities';
import {
  CreateCustomerDto,
  CustomerResponseDto,
  BaseResponseDto,
} from '../common/dto';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new customer',
    description: 'Admin endpoint to create a new customer'
  })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    type: BaseResponseDto<CustomerResponseDto>
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or customer already exists'
  })
  async createCustomer(
    @Body(ValidationPipe) createCustomerDto: CreateCustomerDto,
  ): Promise<BaseResponseDto<CustomerResponseDto>> {
    const customer = this.customerRepository.create({
      ...createCustomerDto,
      isActive: createCustomerDto.isActive ?? true,
    });

    const savedCustomer = await this.customerRepository.save(customer);
    
    return BaseResponseDto.success(
      'Customer created successfully',
      this.mapToResponseDto(savedCustomer)
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get customer by ID',
    description: 'Retrieve a specific customer by their ID'
  })
  @ApiResponse({
    status: 200,
    description: 'Customer retrieved successfully',
    type: BaseResponseDto<CustomerResponseDto>
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found'
  })
  async getCustomerById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<CustomerResponseDto>> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['statements'],
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const customerResponse = this.mapToResponseDto(customer);
    customerResponse.statementCount = customer.statements?.length || 0;
    
    return BaseResponseDto.success(
      'Customer retrieved successfully',
      customerResponse
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all customers',
    description: 'Retrieve all customers'
  })
  @ApiResponse({
    status: 200,
    description: 'Customers retrieved successfully',
    type: BaseResponseDto<CustomerResponseDto[]>
  })
  async getAllCustomers(): Promise<BaseResponseDto<CustomerResponseDto[]>> {
    const customers = await this.customerRepository.find({
      relations: ['statements'],
      order: { createdAt: 'DESC' },
    });

    const customerResponses = customers.map(customer => {
      const response = this.mapToResponseDto(customer);
      response.statementCount = customer.statements?.length || 0;
      return response;
    });
    
    return BaseResponseDto.success(
      `Found ${customers.length} customers`,
      customerResponses
    );
  }

  private mapToResponseDto(customer: Customer): CustomerResponseDto {
    return {
      id: customer.id,
      customerNumber: customer.customerNumber,
      firstName: customer.firstName,
      lastName: customer.lastName,
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      isActive: customer.isActive,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
    };
  }
}