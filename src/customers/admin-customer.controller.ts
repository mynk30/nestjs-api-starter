import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, UseGuards } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { AdminGuard } from "../common/guards/admin.guard";

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/customers')
export class AdminCustomerController {
    constructor(private readonly customersService: CustomersService) { }

    @Get()
    async getAllCustomers() {
        return this.customersService.getAllCustomers();
    }

    @Get(':id')
    async getCustomerById(@Param('id') id: string) {
        return this.customersService.getCustomerById(id);
    }

    @Patch(':id')
    async updateCustomer(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
        return this.customersService.updateProfile(id, updateCustomerDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteCustomer(@Param('id') id: string) {
        return this.customersService.deleteCustomer(id);
    }
}