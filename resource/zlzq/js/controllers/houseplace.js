define(['BaseView', "cUIInputClear", "Model", "Store",], function (BaseView, cUIInputClear, Model, Store) {
    var self;
    var View = BaseView.extend({
        ViewName: 'houseplace',
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
            Lizard.goTo("list.html");
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

            $.ajax({
                url: Lizard.host+Lizard.apiUrl+'realties/get_counts',
               // url: 'http://zlzq.easybird.cn/api/v1/districts',
                dataType: "json",
                contentType: "application/json",
                type: "get",
                success: function (data) {
                    data1={
                        "district_counts": [
                            {
                                "district_id": 2,
                                "district": "位置",
                                "realty_count": 1
                            },]}
                    loc={x:Lizard.P("longitude"),y:Lizard.P("latitude")};
                   callback && callback(data1,loc);
                }
            });
        },
        afterIframeLoad:function() {
            var iDoc = self.iframeContent.contentDocument || iframe.document;
            self.getRealties(function(data,loc){
                self.hideLoading();
                self.iframeContent.contentWindow.drawMap(data,loc);
            });

        },
        onShow: function () {
            self.cancel();
            var noCheck = Lizard.P("noCheck");
            self.setHeader();
            //alert("longitude:"+Lizard.P("longitude"));
            //alert("latitude:"+Lizard.P("latitude"));

         //   self.showLoading();
            //self.hideLoading();
            //$("#headerview").hide();

            if (!self.iframeContent) {
                var iframe = document.createElement("iframe");
                iframe.width = "100%";
                iframe.height =( this.calcPageHeight(document)-40)+"px";
                iframe.src = "./housemap.html";
                iframe.frameBorder = "0";
                iframe.frameBorder = "no";
                iframe.scrolling = "no";
                iframe.border = "0";
                if (navigator.userAgent.indexOf("MSIE") > -1 && !window.opera) {
                    iframe.onreadystatechange = function() {
                        if (iframe.readyState == "complete") {

                            self.afterIframeLoad();
                        }
                    };
                } else {
                    iframe.onload = function() {
                        self.afterIframeLoad();
                    };
                }

                $(self.$el.find(".content")).append(iframe);
                self.iframeContent = iframe;
            }else{
                  self.hideLoading();
            }
        },


        //设置标题
        setHeader: function (type) {
            self.header.set({
                title: '地图位置',
                back: true,
                backtext: '<i class="icon-back "></i> ',
                view: this,
                events: {
                    returnHandler: function () {
                        //Lizard.goTo("house.html?d="+Lizard.P("realtyid"));
                        window.location.href="house.html?d="+Lizard.P("realtyid");
                    },
                    commitHandler: function () {

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
