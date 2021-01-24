import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AdminService } from 'src/app/services/firebase/admin.service';
import { UkmService } from 'src/app/services/firebase/ukm.service';

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.scss']
})
export class NavbarUserComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();

  public loginForm: FormGroup;
  public isFormEmpty: boolean;
  public loading: boolean;
  public errorMessages: string = null;

  constructor(
    public authService: AuthService,
    public adminService: AdminService,
    public ukmService: UkmService,
    public formBuilder: FormBuilder,
    private modalService: NgbModal,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.formValidation();
  }

  formValidation(): void {
    this.loginForm = this.formBuilder.group({
      role: new FormControl("1", [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  openModal(exampleModalContent) {
    this.modalService.open(exampleModalContent);
  }

  async login(): Promise<void> {
    this.loading = true;

    if (!this.loginForm.valid) {
      this.isFormEmpty = true;
      this.loading = false;
    } else {
      this.isFormEmpty = false;

      this.authService.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
        .then((res) => {
          if (this.loginForm.get('role').value == '1') {
            this.getAdmin(this.authService.currentUserId);
          } else {
            this.getUkm(this.authService.currentUserId);
          }
        })
        .catch(error => {
          this.errorMessages = error;
          this.formValidation();
          this.loading = false;
        })
    }
  }

  getAdmin(key): void {
    this.adminService.findByKey(key).pipe(
      take(1),
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loading = false;        
      })
    ).subscribe(
      (data) => {
        if(data !== undefined){
          Object.assign(data, { id: key });
          localStorage.setItem('admin', JSON.stringify(data));
          localStorage.setItem('role', "Administrator");
          this.modalService.dismissAll();
          this.router.navigate(['/dashboard']);
        }else{
          this.authService.signOut();
          this.errorMessages = "Email / Password salah";
        }  
      },
      (error) => { },
    );
  }

  getUkm(key): void {
    this.ukmService.findByKey(key).pipe(
      take(1),
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loading = false;           
      })
    ).subscribe(
      (data) => {
        if(data !== undefined){
          Object.assign(data, { id: key });
          localStorage.setItem('ukm', JSON.stringify(data));
          localStorage.setItem('role', "Admin UKM");
          this.modalService.dismissAll();
          this.router.navigate(['/dashboard']);
        }else{
          this.authService.signOut();
          this.errorMessages = "Email / Password salah";
        }          
      },
      (error) => { },
    );
  }
}
