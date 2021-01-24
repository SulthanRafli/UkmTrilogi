import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";

@Injectable()
export class AdminUkmGuard implements CanActivate {
    canActivate() {
        const role = localStorage.getItem('role');
        if (role == 'Admin UKM') {
            return true;
        } else {
            return false;
        }
    }
}