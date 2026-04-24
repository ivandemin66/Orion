import { IsArray, IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class CreateRunDto {
  @IsString()
  @MinLength(20)
  prompt!: string;

  @IsOptional()
  @IsString()
  projectType?: string;

  @IsOptional()
  @IsArray()
  constraints?: string[];

  @IsOptional()
  @IsIn(["balanced", "ru-first", "cost-saver"])
  providerPolicy?: "balanced" | "ru-first" | "cost-saver";
}
