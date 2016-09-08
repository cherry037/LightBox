(function($){
	function Lightbox(){
		var self=this;
		this.bodyNode=$(document.body);

		//渲染弹出层
		this.renderDom();


		//获取节点
		this.popupMask=this.bodyNode.find('div#G-lightbox-mask');
		this.popupWin=this.bodyNode.find('div#G-lightbox-popup');
		this.popupPicView=this.bodyNode.find('div.lightbox-pic-view');
		this.popupPic=this.bodyNode.find('img.lightbox-image');
		this.prevBtn=this.bodyNode.find('span.lightbox-prev-btn');
		this.nextBtn=this.bodyNode.find('span.lightbox-next-btn');

		this.popupCaptionView=this.bodyNode.find('div.lightbox-pic-caption');
		this.popupCaption=this.bodyNode.find('p.lightbox-caption-desc');
		this.popupIndex=this.bodyNode.find('p.lightbox-of-index');
		this.closeBtn=this.bodyNode.find('span#lightbox-close-btn');

		//存储同一组图片
		this.groupName=null;
		this.groupData=[];
		this.index=null;
		//点击图片，弹出遮罩和弹出框
		this.bodyNode.delegate('.js-lightbox','click',function(e){
			e.stopPropagation();
			//获取点击元素的同一组图片
			var currentGroup=$(this).attr('data-group');
			if(self.groupName!=currentGroup){
				self.groupName=currentGroup;
			}
			self.getGroupList();

			//弹出遮罩和弹出框
			var sourceSrc=$(this).attr('data-source');
			self.index=self.getIndex($(this));
			self.popupMaskandWin(sourceSrc,self.groupData[self.index-1]);
			

		});

		this.popupMask.click(function(){
			$(this).fadeOut();
			self.popupWin.fadeOut();
		});

		this.closeBtn.click(function(){
			self.popupMask.fadeOut();
			self.popupWin.fadeOut();
		});

		this.prevBtn.hover(function(){
			$(this).removeClass('disabled').addClass('lightbox-btn');
		},function() {
			$(this).addClass('disabled');
		}).click(function(){
			self.changePic('prev');
		});

		this.nextBtn.hover(function(){
			$(this).removeClass('disabled').addClass('lightbox-btn');
		},function() {
			$(this).addClass('disabled');
		}).click(function(){
			self.changePic('next');
		});
	}

	Lightbox.prototype={
		classifyIndexBtn:function(){
			var self=this;
			var len=this.groupData.length;
			if(len===1){
				self.prevBtn.addClass('disappear');
				self.nextBtn.addClass('disappear');
			}else{
				if(self.index<=1){
				self.prevBtn.addClass('disappear');
				self.nextBtn.removeClass('disappear');
				}else if(self.index===len){
				self.prevBtn.removeClass('disappear');
				self.nextBtn.addClass('disappear');
				}else{
				self.prevBtn.removeClass('disappear');
				self.nextBtn.removeClass('disappear');
				}
			}
		},
		changePic:function(dir){
			var self=this;
			if(dir==='next'){
				self.index++;
				self.sourceSrc=self.groupData[self.index-1].src;
				self.getImgSize(self.sourceSrc,self.groupData[self.index-1]);
			}else if(dir==='prev'){
				self.index--;
				self.sourceSrc=self.groupData[self.index-1].src;
				self.getImgSize(self.sourceSrc,self.groupData[self.index-1]);
			}

		},
		getIndex:function(currentObj){
			var self=this;
			var index=0;
			$(this.groupData).each(function(i){
				if(this.id===currentObj.attr('data-id')){
					index=i+1;
					return false;
				}
			});
			return index;
		},
		showCaption:function(currentObj){
			var self=this;
			this.popupCaptionView.show();
			this.popupCaption.text(currentObj.caption);
			this.popupIndex.text("当前索引："+self.index+"/"+self.groupData.length);

		},
		getImgSize:function(sourceSrc,currentObj){
			var self=this;
			var img=new Image();
			$(img).attr('src',sourceSrc);
			this.bodyNode.append(img);
			$(img).addClass('disabled');
			var winWidth=$(window).width();
			var winHeight=$(window).height();
			var width=$(img).width();
			var height=$(img).height();
			$(img).remove();
			// var scale=Math.min(winWidth/width,winHeight/height,1);
			// width=width*scale;
			// height=height*scale;
			if(height>=winHeight){	
				width=width*(winHeight/height);
				height=winHeight;
			}
			if(width>=winWidth){
				height=height*(winWidth/width);
				width=winWidth;
			}
			self.popupWin.css({width:'auto',height:'auto'});
			self.popupWin.css({
				top:(winHeight-height)/2,
					marginLeft:-width/2,
					width:width,
					height:height,
				});
			self.popupPic.attr('src',sourceSrc);
			self.popupPic.css({
				width:width,
				height:height
			});
			self.classifyIndexBtn();
			self.showCaption(currentObj);
		},
		popupMaskandWin:function(sourceSrc,currentObj){
			var self=this;
			this.popupMask.fadeIn();
			this.popupCaptionView.hide();
			this.popupWin.css({
				width:25,
				height:25
			});
			this.prevBtn.addClass('disabled');
			this.nextBtn.addClass('disabled');
			this.popupWin.fadeIn();
			var winWidth=$(window).width();
			var winHeight=$(window).height();
			
			var height=this.popupWin.height();
			var width=this.popupWin.width();
			this.popupWin.css({
				top:-(winHeight-height)/2,
				marginLeft:-(width)/2
			}).animate({
				top:(winHeight-height)/2,
			},function(){
				//加载图片
				self.getImgSize(sourceSrc,currentObj);
			});
		},
		getGroupList:function(){
			var self=this;
			this.groupData.length=0;
			var groupList=this.bodyNode.find('img.js-lightbox');
			groupList.each(function(){
				if($(this).attr('data-group')===self.groupName){
					self.groupData.push({
						src:$(this).attr('data-source'),
						id:$(this).attr('data-id'),
						caption:$(this).attr('data-caption')
					});
				}
			});
			return this.groupData;
		},
		renderDom:function(){
			var strDom='<div id="G-lightbox-mask"></div><div id="G-lightbox-popup"><div class="lightbox-pic-view"><span class="lightbox-prev-btn lightbox-btn"><</span><span class="lightbox-next-btn lightbox-btn">></span><img class="lightbox-image" src=""/></div><div class="lightbox-pic-caption"><div class="lightbox-caption-area"><p class="lightbox-caption-desc">jdjkdkkk</p><p class="lightbox-of-index">0/4</p></div><span id="lightbox-close-btn">x</span></div></div>';
			this.bodyNode.append(strDom);
		}
	};
	window['Lightbox']=Lightbox;
})(jQuery);