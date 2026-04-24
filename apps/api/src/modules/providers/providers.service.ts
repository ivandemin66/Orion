import { Injectable } from "@nestjs/common";
import { defaultProviders } from "@mass/domain";

@Injectable()
export class ProvidersService {
  listProviders() {
    return defaultProviders;
  }
}

