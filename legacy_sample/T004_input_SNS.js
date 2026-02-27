// T004_input_SNS.js
class T004InputSNS {
    constructor(element) {
        this.element = element;
        this.selectedGender = 'male';
        this.isVerified = false;
        this.touchedFields = {
            name: false,
            birth: false
        };
        this.init();
    }
    
    init() {
        this.attachEvents();
        this.initializeState();
        this.validateForm();
    }
    
    initializeState() {
        // 체크박스 초기 상태 (기본값: 체크 안함)
        const checkbox = this.element.querySelector('.checkbox-input');
        if (checkbox) {
            checkbox.checked = false;
        }
        
        // 성별 초기 상태 (남자 선택)
        const maleRadio = this.element.querySelector('input[name="gender"][value="male"]');
        if (maleRadio) {
            maleRadio.checked = true;
            const maleLabel = maleRadio.closest('.gender-btn');
            if (maleLabel) {
                maleLabel.classList.add('active');
            }
        }
        
        // 인증하기 버튼 초기 비활성화
        this.updateVerifyButton();
    }
    
    validateForm() {
        // 보험료 확인하기 버튼은 항상 활성화 상태 유지
        // 유효성 검사는 버튼 클릭 시 handleSubmit에서 수행
        const submitBtn = this.element.querySelector('.btn-submit');
        if (submitBtn) {
            submitBtn.classList.add('active');
        }
    }
    
    attachEvents() {
        // SNS 로그인 버튼
        const snsButtons = this.element.querySelectorAll('.btn-sns');
        snsButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSNSLogin(e));
        });
        
        // 성별 토글 (radio button)
        const genderRadios = this.element.querySelectorAll('input[name="gender"]');
        genderRadios.forEach(radio => {
            radio.addEventListener('change', (e) => this.handleGenderToggle(e));
        });
        
        // 이름 입력
        const nameInput = this.element.querySelector('.input-with-gender .input-field');
        if (nameInput) {
            nameInput.addEventListener('input', () => {
                this.validateFieldOnInput('name');
                this.updateVerifyButton();
                this.validateForm();
            });
        }
        
        // 생년월일 입력 (숫자만)
        const birthInput = this.element.querySelector('.input-group:nth-child(2) .input-field');
        if (birthInput) {
            birthInput.addEventListener('input', (e) => {
                this.handleNumberInput(e);
                this.validateFieldOnInput('birth');
                this.updateVerifyButton();
                this.validateForm();
            });
        }
        
        // 연락처 입력 (숫자만)
        const phoneInput = this.element.querySelector('.phone-number');
        if (phoneInput) {
            phoneInput.addEventListener('focus', (e) => {
                // 포커스 시 하이픈 제거
                e.target.value = e.target.value.replace(/-/g, '');
            });
            phoneInput.addEventListener('input', (e) => {
                this.handleNumberInput(e);
                // 8자리 입력 완료 시 즉시 하이픈 추가 (1234-5678)
                const value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length === 8) {
                    e.target.value = value.replace(/(\d{4})(\d{4})/, '$1-$2');
                }
                this.updateVerifyButton();
                this.validateForm();
            });
        }
        
        // 인증하기 버튼
        const verifyBtn = this.element.querySelector('.btn-verify');
        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => {
                this.handleVerification();
            });
        }
        
        // 인증확인 버튼
        const verifyCheckBtn = this.element.querySelector('.btn-verify-check');
        if (verifyCheckBtn) {
            verifyCheckBtn.addEventListener('click', () => this.handleVerificationCheck());
        }
        
        // 인증번호 입력 (숫자만)
        const verificationInput = this.element.querySelector('.verification-code');
        if (verificationInput) {
            verificationInput.addEventListener('input', (e) => this.handleNumberInput(e));
        }
        
        // 체크박스
        const checkbox = this.element.querySelector('.checkbox-input');
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                this.handleCheckbox(e);
                this.validateForm();
            });
        }
        
        // 제출 버튼
        const submitBtn = this.element.querySelector('.btn-submit');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.handleSubmit());
        }
        
        // 도움말 링크
        const helpLink = this.element.querySelector('[data-action="show-sms-help"]');
        if (helpLink) {
            helpLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSmsHelpModal();
            });
        }
    }
    
    checkPreviousFields() {
        // 다른 필드로 이동 시 이전 필드들 검증
        this.validateFieldOnBlur('name');
        this.validateFieldOnBlur('birth');
    }
    
    updateVerifyButton() {
        const nameInput = this.element.querySelector('.input-with-gender .input-field');
        const birthInput = this.element.querySelector('.input-group:nth-child(2) .input-field');
        const phoneInput = this.element.querySelector('.phone-number');
        const verifyBtn = this.element.querySelector('.btn-verify');

        if (!phoneInput || !verifyBtn) return;

        // 이름, 생년월일, 연락처 모두 입력되어야 인증하기 버튼 활성화
        // 연락처는 하이픈 제거 후 길이 체크
        const isValid =
            nameInput?.value.trim() &&
            birthInput?.value.length === 8 &&
            phoneInput.value.replace(/-/g, '').length === 8;

        if (isValid) {
            verifyBtn.disabled = false;
            verifyBtn.style.background = '#FF9B00';
            verifyBtn.style.borderColor = '#FF9B00';
            verifyBtn.style.color = '#FFFFFF';
            verifyBtn.style.cursor = 'pointer';
        } else {
            verifyBtn.disabled = true;
            verifyBtn.style.background = '#F3F3F6';
            verifyBtn.style.borderColor = '#DCDCDE';
            verifyBtn.style.color = '#B8B8BB';
            verifyBtn.style.cursor = 'not-allowed';
        }
    }
    
    validateFieldOnInput(fieldName) {
        // 입력 중에는 에러 제거
        const nameGroup = this.element.querySelector('.input-group:nth-child(1)');
        const birthGroup = this.element.querySelector('.input-group:nth-child(2)');
        const nameInput = this.element.querySelector('.input-with-gender .input-field');
        const birthInput = this.element.querySelector('.input-group:nth-child(2) .input-field');
        
        if (fieldName === 'name' && nameInput?.value.trim()) {
            nameGroup?.classList.remove('error');
        }
        
        if (fieldName === 'birth' && birthInput?.value.length === 8) {
            birthGroup?.classList.remove('error');
        }
    }
    
    validateFieldOnBlur(fieldName) {
        const nameGroup = this.element.querySelector('.input-group:nth-child(1)');
        const birthGroup = this.element.querySelector('.input-group:nth-child(2)');
        const nameInput = this.element.querySelector('.input-with-gender .input-field');
        const birthInput = this.element.querySelector('.input-group:nth-child(2) .input-field');
        
        if (fieldName === 'name') {
            this.touchedFields.name = true;
            if (!nameInput?.value.trim()) {
                nameGroup?.classList.add('error');
            } else {
                nameGroup?.classList.remove('error');
            }
        }
        
        if (fieldName === 'birth') {
            this.touchedFields.birth = true;
            if (birthInput?.value.length !== 8) {
                birthGroup?.classList.add('error');
            } else {
                birthGroup?.classList.remove('error');
            }
        }
    }
    
    handleSNSLogin(e) {
        const snsType = e.currentTarget.dataset.sns;
        console.log(`${snsType} 로그인 시도`);
        // 실제 SNS 로그인 로직 구현
        alert(`${snsType === 'kakao' ? '카카오' : '네이버'} 로그인 기능은 구현 예정입니다.`);
    }
    
    handleGenderToggle(e) {
        const selectedRadio = e.currentTarget;
        const gender = selectedRadio.value;

        // 모든 label에서 active 제거
        const genderLabels = this.element.querySelectorAll('.gender-btn');
        genderLabels.forEach(label => label.classList.remove('active'));

        // 선택된 radio의 label에 active 추가
        const selectedLabel = selectedRadio.closest('.gender-btn');
        if (selectedLabel) {
            selectedLabel.classList.add('active');
        }

        this.selectedGender = gender;

        console.log('선택된 성별:', gender);
    }
    
    handleNumberInput(e) {
        // 숫자만 입력 허용
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    }
    
    handleVerification() {
        const phoneInput = this.element.querySelector('.phone-number');
        const phoneGroup = this.element.querySelector('.input-group:nth-child(3)');
        const verifyBtn = this.element.querySelector('.btn-verify');

        if (!phoneInput || !phoneGroup || !verifyBtn) return;

        // 비활성화 상태면 동작하지 않음
        if (verifyBtn.disabled) {
            return;
        }

        // 하이픈 제거 후 검증
        const phoneValue = phoneInput.value.replace(/-/g, '');
        const phone = '010' + phoneValue;

        if (phoneValue.length < 8) {
            alert('연락처 8자리를 입력해주세요.');
            return;
        }
        
        console.log('인증번호 발송:', phone);
        alert('인증번호가 발송되었습니다.');
        
        // 인증번호 발송 후 정보 메시지 표시
        phoneGroup.classList.add('verified');
        
        // 인증번호 입력 필드 활성화
        const verificationInput = this.element.querySelector('.verification-code');
        if (verificationInput) {
            verificationInput.disabled = false;
            verificationInput.focus();
        }
    }
    
    handleVerificationCheck() {
        const verificationInput = this.element.querySelector('.verification-code');
        
        if (!verificationInput) return;
        
        if (verificationInput.value.length !== 5) {
            alert('인증번호 5자리를 입력해주세요.');
            return;
        }
        
        // 실제로는 서버에서 인증번호 검증
        console.log('인증번호 확인:', verificationInput.value);
        this.isVerified = true;
        alert('인증이 완료되었습니다.');
        
        // 폼 유효성 재검사
        this.validateForm();
    }
    
    handleCheckbox(e) {
        const isChecked = e.target.checked;
        console.log('개인정보 동의:', isChecked);
    }
    
    handleSubmit() {
        // 입력값 검증
        const nameInput = this.element.querySelector('.input-with-gender .input-field');
        const birthInput = this.element.querySelector('.input-group:nth-child(2) .input-field');
        const phoneInput = this.element.querySelector('.phone-number');
        const checkbox = this.element.querySelector('.checkbox-input');

        const nameGroup = this.element.querySelector('.input-group:nth-child(1)');
        const birthGroup = this.element.querySelector('.input-group:nth-child(2)');
        const phoneGroup = this.element.querySelector('.input-group:nth-child(3)');

        // 에러 상태 초기화
        this.element.querySelectorAll('.input-group').forEach(group => {
            group.classList.remove('error');
        });

        // 순서대로 검증하여 첫 번째 에러만 표시
        // 1. 이름 검증
        if (!nameInput || !nameInput.value.trim()) {
            nameGroup?.classList.add('error');
            nameInput?.focus();
            return;
        }

        // 2. 생년월일 검증
        if (!birthInput || birthInput.value.length !== 8) {
            birthGroup?.classList.add('error');
            birthInput?.focus();
            return;
        }

        // 3. 연락처 검증
        if (!phoneInput || phoneInput.value.replace(/-/g, '').length < 8) {
            phoneGroup?.classList.add('error');
            phoneInput?.focus();
            return;
        }

        // 4. 인증 확인
        if (!this.isVerified) {
            alert('연락처 인증을 완료해주세요.');
            return;
        }

        // 5. 개인정보 동의 확인
        if (!checkbox || !checkbox.checked) {
            alert('개인정보 수집 및 활용에 동의해주세요.');
            return;
        }
        
        // 폼 데이터 수집
        const formData = {
            name: nameInput.value,
            gender: this.selectedGender,
            birth: birthInput.value,
            phone: '010' + phoneInput.value,
            verified: this.isVerified,
            agreed: checkbox.checked
        };
        
        console.log('제출 데이터:', formData);
        
        // 스피너 표시
        if (window.showSpinner) {
            window.showSpinner();
            
            // 3초 후 스피너 숨김 → 완료 모달 표시 → T006_F01_4 업데이트
            setTimeout(() => {
                if (window.hideSpinner) {
                    window.hideSpinner();
                }
                
                // T006_F01_4 컴포넌트에 계산 결과 반영
                this.updateInsuranceInfo(formData);
                
                // 완료 모달 표시
                if (window.showCompletionModal) {
                    window.showCompletionModal();
                } else {
                    // 모달이 없는 경우 기본 동작
                    alert('보험료 확인 페이지로 이동합니다.');
                }
                
                // T005 영역 전환 (before -> after)
                this.switchT005ToAfter();
            }, 3000);
        } else {
            // 스피너가 없는 경우 기본 동작
            this.updateInsuranceInfo(formData);
            alert('보험료 확인 페이지로 이동합니다.');
            
            // T005 영역 전환 (before -> after)
            this.switchT005ToAfter();
        }
    }
    
    switchT005ToAfter() {
        const beforeElement = document.querySelector('[data-component="T005_E02_5_before"]');
        const afterElement = document.querySelector('[data-component="T005_E02_5_after"]');
        
        if (beforeElement && afterElement) {
            beforeElement.style.display = 'none';
            afterElement.style.display = 'flex';  // flex로 변경하여 gap이 제대로 작동하도록
            
            // 부드러운 스크롤로 T005 영역으로 이동
            setTimeout(() => {
                afterElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }
    
    updateInsuranceInfo(formData) {
        // T006_F01_4 컴포넌트 찾기
        const t006Element = document.querySelector('[data-component="T006_F01_4"]');
        if (!t006Element) {
            console.warn('T006_F01_4 컴포넌트를 찾을 수 없습니다.');
            return;
        }
        
        // T006_F01_4 인스턴스 찾기 또는 생성
        let t006Instance = null;
        
        // 전역에 저장된 인스턴스 찾기
        if (window.T006_F01_4_instances) {
            t006Instance = window.T006_F01_4_instances.find(inst => inst.element === t006Element);
        }
        
        // 인스턴스가 없으면 새로 생성
        if (!t006Instance && typeof T006_F01_4 !== 'undefined') {
            t006Instance = new T006_F01_4(t006Element);
        }
        
        if (t006Instance) {
            // 생년월일과 이름으로 보험 정보 업데이트
            t006Instance.setUserData(formData.name, formData.birth);
            console.log('T006_F01_4 업데이트 완료:', formData.name, formData.birth);
        } else {
            console.warn('T006_F01_4 인스턴스를 생성할 수 없습니다.');
        }
    }
    
    showSmsHelpModal() {
        // 전역 함수로 모달 열기
        if (typeof window.showSmsHelpModal === 'function') {
            window.showSmsHelpModal();
        } else {
            console.warn('showSmsHelpModal 함수를 찾을 수 없습니다.');
        }
    }
}

// 컴포넌트 초기화
document.addEventListener('DOMContentLoaded', () => {
    const components = document.querySelectorAll('[data-component="T004_input_SNS"]');
    components.forEach(el => {
        new T004InputSNS(el);
    });
});
