define(['BaseView', "cUIInputClear", "Model", "Store",], function (BaseView, cUIInputClear, Model, Store) {
    var self;
    var View = BaseView.extend({
        ViewName: 'index',
        events: {
            "click  .btn_link1": "toSignIn",
            "click .btn_reg": "toReg",
            "click .btn_get_password": "toResetPsw",
            "input .user_name_box": "toValidatePhone",
            "click .code_img": "toResetValidateCode",
            "click .favourite":"toFavorite",

            "click .location_icon" :"toLocation",
            "click .search-icon":"toSearch",
            "click .c-ct ":"toList",
            "click .r-bar .search-box-mask":"toGetAreaList",
            "click .r-bar .btn":"toSearch",
            "click .bottom-bar .rent":"toRent",
            "click .bottom-bar .mine":"toPersonal",
            "click .bottom-bar .order":"toOrderList",
            //"click .bottom-bar .schedule":"toSchedule"
        },
        cancel:function(e){
            self.$el.find(".r-bar input").val("");
            self.$el.find(".searchBar-inner").removeClass("active");
        },



        toGetAreaList:function(e){
            self.$el.find(".searchBar-inner").addClass("active");
            self.$el.find(".r-bar input").focus();
        },
        toPersonal:function(e){
            if(this.isLogin()){
                Lizard.goTo("user.html");
            }else Lizard.goTo("login.html");
        },
        toSchedule:function(e){
            Lizard.goTo("schedule.html");
        },

        toList:function(e){
            Lizard.goTo("list.html?index=1");
        },

        toFavorite:function(e){
            self.toggleSideBar();
            Lizard.goTo("list.html?favorite=1");
        },
        gotoSource: function () {
            $("#map_canvas").hide();
            Lizard.goTo('source.html');
        }
        ,
        ajaxException: function (msg) {
            self.loginBtn.html("登录");
            self.hideLoading();
            self.showMyToast('网络错误，请重试', 2000);
        },
        onCreate: function () {
            self = this;
        },
        calcPageHeight: function(doc) {
            var cHeight = Math.max(doc.body.clientHeight, doc.documentElement.clientHeight);
            var sHeight = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
            var height = Math.max(cHeight, sHeight);
            return height;

        },
        getRealties:function(callback) {
            //以下代码
            $.ajax({
                url: Lizard.host+Lizard.apiUrl+'realties/get_counts',
               // url: 'http://zlzq.easybird.cn/api/v1/districts',
                dataType: "json",
                contentType: "application/json",
                type: "get",
                success: function (data) {
                    self.countnew=data;
                   callback && callback(data);
                }
            });

            //以下测试代码
            //var data={
            //    "district_counts": [
            //        {
            //            "district_id": 2,
            //            "district": "浦东新区",
            //            "realty_count": 76
            //        },
            //        {
            //            "district_id": 3,
            //            "district": "闵行区",
            //            "realty_count": 41
            //        },
            //        {
            //            "district_id": 4,
            //            "district": "静安区",
            //            "realty_count": 5
            //        },
            //        {
            //            "district_id": 6,
            //            "district": "闸北区",
            //            "realty_count": 12
            //        },
            //        {
            //            "district_id": 7,
            //            "district": "黄浦区",
            //            "realty_count": 8
            //        },
            //        {
            //            "district_id": 8,
            //            "district": "虹口区",
            //            "realty_count": 13
            //        },
            //        {
            //            "district_id": 12,
            //            "district": "长宁区",
            //            "realty_count": 20
            //        },
            //        {
            //            "district_id": 13,
            //            "district": "普陀区",
            //            "realty_count": 24
            //        },
            //        {
            //            "district_id": 15,
            //            "district": "徐汇区",
            //            "realty_count": 25
            //        }
            //    ]
            //}
            //self.countnew=data;
            //callback && callback(data);

        },
        afterIframeLoad:function() {
            var iDoc = self.iframeContent.contentDocument || iframe.document;
            self.getRealties(function(data){
                self.hideLoading();
                self.iframeContent.contentWindow.drawMap(data);
            });

        },
        onShow: function () {
            self.cancel();
            var noCheck = Lizard.P("noCheck");
            $("#headerview").hide();

            self.getRealties();
            if(self.countnew&&self.countold){
                self.countflag=true;
                for(i=0;i<self.countnew.district_counts.length;i++){
                    if(self.countnew.district_counts[i].realty_count!=self.countold.district_counts[i].realty_count){
                        self.countflag=false;
                        break;
                    }
                }
            }else{
                self.countflag=false;
            }
            if(self.countflag){
                self.hideLoading();
            }else {
                $(self.$el.find(".content")).empty();
                var iframe = document.createElement("iframe");
                iframe.width = "100%";
                iframe.height = ( this.calcPageHeight(document) - 40) + "px";
                iframe.src = "./map.html";
                iframe.frameBorder = "0";
                iframe.frameBorder = "no";
                iframe.scrolling = "no";
                iframe.border = "0";
                if (navigator.userAgent.indexOf("MSIE") > -1 && !window.opera) {
                    iframe.onreadystatechange = function () {
                        if (iframe.readyState == "complete") {
                            self.afterIframeLoad();
                        }
                    };
                } else {
                    iframe.onload = function () {
                        self.afterIframeLoad();
                    };
                }

                $(self.$el.find(".content")).append(iframe);
                self.iframeContent = iframe;
                self.countold=self.countnew;
            }
        },


        //设置标题
        setHeader: function (type) {
            self.header.set({
                title: '&nbsp;',
                back: !0,
                backtext: '<i class="top_more left"></i> ',
                view: this,
                btn: {
                    title: '<i class="top_more right"></i>',
                    id: 'confirm-btn',
                    classname: 'right_btn'
                },
                events: {
                    returnHandler: function () {
                      self.toggleSideBar();
                    },
                    commitHandler: function () {
                        self.$('.searchBar').toggleClass('active');
                    }
                }
            });
        },
        onHide: function () {
            $("#headerview").show();
        }
    });

    return View;
})
