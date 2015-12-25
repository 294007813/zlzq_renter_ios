define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","UIGroupSelect","text!TplPersonal","MegaPixImage"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,UIGroupSelect,tplPersonal,MegaPixImage) {
    var self;
    var View = BaseView.extend({
        ViewName: 'personal.',
        events: {
            "click .housing .btn": "toReserve",
            "click .location_icon": "toLocation",
            "click .search-btn": "toSearch",
            "click .personal .opt-list .name": "toUpdateName",
            "click #confirm-btn": "ensureName",
            /*"click .personal .opt-list .gender":"toUpdateGender",*/
            "click .personal .opt-list .pwd": "toUpdatePwd",
            "click .personal .opt-list .my-invitecode": "toApply",
            //"click .personal .opt-list .tel":"toUpdateTel",
            "click .gender-box div": "selectGender",
            "click .loginout": "loginout",
            "click .avatar-box ": "modifyPic",//选择修改头像
            "click  .pic-box .cancel": "cancelEditing",
            "change .photos": "readFile",//选择相册
            "click #camera": "camera"//拍照

        },

        toUpdateTel: function () {
            self.$el.find(".personal").addClass("tel-active");
            self.setTelHeader();
        },
        camera: function (e) {
            self.iframeContent.contentWindow.getPictureFromCamera(function(data){
                $('#picture').attr('src','data:image/jpeg;base64,'+data);
                self.cancelEditing();
                self.uploadPicture(data);
            })

        },
        //点击选择相册
        readFile: function (e) {
            var self=this,
                file = e.currentTarget.files[0];

            self.cancelEditing();

            var mpImg = new MegaPixImage(file),
                _canvas=document.getElementById("g_canvas");
            var _max = 320;
            mpImg.render(_canvas, {
                maxHeight: _max
            },function(){
                var  src = _canvas.toDataURL("image/jpeg");
                $('#picture')[0].src = src;
                self.uploadPicture(src.substring(src.lastIndexOf(";")+8));
            })

        },
        uploadPicture:function(data){
            self.showLoading();
            var url = Lizard.host + Lizard.apiUrl + "renters/"+self.user.actor_id+"/save_avatar?auth_token="+ self.user.authentication_token;
            $.ajax({
                url: url,
                type: "POST",
                data:{ "avatar" : 'data:image/jpeg;base64,' + data },
                success: function (data) {
                    self.hideLoading();
                    self.showMyToast("上传成功", 1500);
                    self.login();


                },
                error: function (e) {
                    self.hideLoading();
                    self.showMyToast("网络错误", 1000);


                }
            });

        },
        cancelEditing: function (e) {
            this.$el.find(".pic-box").hide();
        },
        modifyPic: function (e) {
            this.$el.find(".pic-box").show();
        },
        loginout: function (e) {
            var user = self.getCurrentUser();
            self.showLoading();
            var url = Lizard.host + Lizard.apiUrl + "users/" + user.id;
            $.ajax({
                url: url,
                type: "DELETE",
                success: function (data) {
                    self.hideLoading();
                    if (data.success) {
                        self.setLoginStatus({});
                        Lizard.goTo("login.html");
                    }
                },
                error: function (e) {
                    self.hideLoading();
                    self.showMyToast("网络错误", 1000);
                }
            });
        },

        modifyPwd: function (e) {
            var oldPwd = $.trim(self.$el.find(".pwd_box .old-password").val());
            if (!oldPwd) {
                self.showMyToast("请入原来的密码", 1000);
                return
            }
            var newPwd = $.trim(self.$el.find(".pwd_box .new-password").val());
            if (!newPwd) {
                self.showMyToast("请入密码", 1000);
                return
            }
            if (newPwd.length < 8) {
                this.showMyToast("密码至少8位", 1000);
                return;
            }
            var confirmPwd = $.trim(self.$el.find(".pwd_box .confirm-password").val());
            if (!confirmPwd) {
                self.showMyToast("请入确认密码", 1000);
                return
            }
            if (confirmPwd != newPwd) {
                self.showMyToast("密码与确认密码不一致", 1000);
                return
            }
            var user = self.getCurrentUser();
            self.showLoading();
            var url = Lizard.host + Lizard.apiUrl + "users/" + user.id;
            $.ajax({
                url: url,
                type: "PUT",
                data: {cell: user.cell, password: newPwd, auth_token: user.authentication_token},
                success: function (data) {
                    self.hideLoading();
                    if (data.message == "success") {
                        self.$el.find(".personal").removeClass("pwd-active");
                        self.setHeader();
                        self.showMyToast("修改密码成功！", 1000);
                    }

                },
                error: function (e) {
                    self.hideLoading();
                    self.showMyToast("网络错误", 1000);
                }
            });


        },

        setTelHeader: function () {
            self.header.set({
                title: '手机号码',
                back: true,
                backtext: '取消',
                view: this,
                btn: {
                    title: '保存',
                    id: 'confirm-btn',
                    classname: 'right_btn'
                },
                events: {
                    returnHandler: function () {
                        self.$el.find(".personal").removeClass("tel-active");
                        self.setHeader();
                    },
                    commitHandler: function () {

                    }
                }
            });

        },


        selectGender: function (e) {
            var target = $(e.currentTarget);
            self.$el.find(".gender-box div").each(function () {
                $(this).removeClass("selected");
            })
            target.addClass("selected");
        },

        toUpdatePwd: function () {
            self.$el.find(".personal").addClass("pwd-active");
            self.setpwdHeader();
        },
        setpwdHeader: function () {
            self.header.set({
                title: '修改密码',
                back: true,
                backtext: '取消',
                view: this,
                btn: {
                    title: '保存',
                    id: 'confirm-btn',
                    classname: 'right_btn'
                },
                events: {
                    returnHandler: function () {
                        self.$el.find(".personal").removeClass("pwd-active");
                        self.setHeader();
                    },
                    commitHandler: function () {
                        self.modifyPwd();
                    }
                }
            });
        },


        /* toUpdateGender:function() {
         self.$el.find(".personal").addClass("gender-active");
         self.setGenderHeader();

         },*/
        /*setGenderHeader:function() {
         self.header.set({
         title: '性别',
         back: true,
         backtext: '取消',
         view: this,
         btn: {
         title: '保存',
         id: 'confirm-btn',
         classname: 'right_btn'
         },
         events: {
         returnHandler: function () {
         self.$el.find(".personal").removeClass("gender-active");
         self.setHeader();
         },
         commitHandler: function () {

         }
         }
         });

         },*/
        toUpdateName: function () {
            self.$el.find(".personal").addClass("name-active");
            self.setNameHeader();
        },
        setNameHeader: function () {
            self.header.set({
                title: '名字',
                back: true,
                backtext: '取消',
                view: this,
                btn: {
                    title: '保存',
                    id: 'confirm-btn',
                    classname: 'right_btn'
                },
                events: {
                    returnHandler: function () {
                        self.$el.find(".personal").removeClass("name-active");
                        self.setHeader();
                    },
                    commitHandler: function () {
                        self.ensureName();
                    }
                }
            });
        },
        //
        ensureName: function () {

            self.showLoading();
            var url = Lizard.host + Lizard.apiUrl + "renters/" + self.getCurrentUser().actor_id;
            $.ajax({
                url: url,
                type: "PUT",
                dataType: "json",
                data: {
                    "renter[nick_name]": self.$el.find(".name-box .name").val(),
                    auth_token: self.getCurrentUser().authentication_token
                },
                success: function (data) {
                    self.hideLoading();
                    self.showMyToast("修改成功！", 1000);

                    self.login();

                },
                error: function (e) {
                    self.hideLoading();
                    self.showMyToast("网络错误", 1000);
                }
            });
        },

        login: function () {
            var url = Lizard.host + Lizard.apiUrl + "users/login";
            $.ajax({
                url: url,
                dataType: "json",
                type: "post",
                data: {cell: self.getCurrentUser().cell, password: self.getCurrentUser().pwd},
                success: function (data) {
                    self.hideLoading();
                    if (data.error) {

                        return
                    }
                    if (data.user) {


                        data.user.token = data.token;
                        data.user.nick_name = data.nick_name;
                        data.user.avatar = data.avatar;
                        data.user.pwd = self.getCurrentUser().pwd;
                        self.setLoginStatus({isLogin: true, user: data.user, token: data.token});

                        //Lizard.goTo("personal.html");
                        window.location.href="personal.html";

                    }

                },
                error: function (e) {
                    self.hideLoading();
                    self.showMyToast("网络错误", 1000);
                }
            });
        },


        selectDate: function (e) {
            self.dateScroller.show();
        },
        toReserve: function (e) {
            self.$el.find(".info_ct").hide();
            self.$el.find(".housing").hide();
            self.$el.find(".reserve_ct").show();
        },
        ajaxException: function (msg) {
            self.loginBtn.html("登录");
            self.hideLoading();
            self.showMyToast('网络错误，请重试', 2000);
        },

        onCreate: function () {
            self = this;
        },
        GetData: function (e) {
            this.showLoading();
            var url = Lizard.host + Lizard.apiUrl + "users/" + self.getCurrentUser().id + "?auth_token=" + self.getCurrentUser().token + "&t=" + (+new Date());
            $.ajax({
                url: url,
                dataType: "json",
                type: "get",
                success: function (data) {
                    self.hideLoading();
                    data = data || {};
                    self.$el.html(_.template(tplPersonal)({
                        user: {
                            nick_name: self.user.nick_name,
                            cell: self.user.cell,
                            avatar: self.user.avatar.avatar.url,
                            balance: data.balance || self.user.balance,
                            invite_code: data.invited_code || self.user.invited_code
                        }

                    }));

                    self.$el.find("#picture").attr("src", self.user.avatar.avatar.url);
                    self.hideLoading();
                },
                error: function (e) {
                    self.hideLoading();
                    self.showMyToast("网络错误", 1000);
                }
            });

        },


        onShow: function () {
            self.setHeader();
            self.user=self.getCurrentUser();
            self.GetData();
            $('body').append($('<canvas id="g_canvas" style="display: none;"></canvas>'));

            $('body').append($('<canvas id="g_canvas" style="display: none;"></canvas>'));

        },
        //设置标题
        setHeader: function () {
            self.header.set({
                title: '个人信息',
                back: true,
                backtext: '<i class="icon-back "></i> ',
                view: this,

                events: {
                    returnHandler: function () {
                        Lizard.goTo("user.html");
                    },
                    commitHandler: function () {

                    }
                }
            });
        },
        onHide: function () {

        }
    });

    return View;
})
