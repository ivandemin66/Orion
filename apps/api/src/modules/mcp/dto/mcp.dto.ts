import { IsArray, IsBoolean, IsOptional, IsString, IsUrl, MinLength } from "class-validator";

export class CreateMcpServerDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  transport!: string;

  @IsUrl()
  endpoint!: string;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsArray()
  allowedAgents?: string[];
}

export class UpdateMcpServerDto {
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsArray()
  allowedAgents?: string[];
}

