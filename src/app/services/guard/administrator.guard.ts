import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";

@Injectable()
export class AdministratorGuard implements CanActivate {
    canActivate() {
        const role = localStorage.getItem('role');
        if (role == 'Administrator') {
            return true;
        } else {
            return false;
        }
    }
}