import React from 'react'
import classNames from 'classnames'
import Notification from './Notification'

// Toast组件比较特殊
// 因为<Toast />不会被直接渲染在DOM中
// 而是动态插入页面中
// Toast组件核心就是通过Notification暴露的重写方法 动态改变Notification
let newNotification;

// 获得一个Notification
const getNewNotification = () => {
    // 单例 保持页面始终只有一个Notification
    if (!newNotification) {
        newNotification = Notification.reWrite();
    }

    return newNotification;
};

// notice方法实际上就是集合参数 完成对Notification的改变
const notice = (content, type, duration = 5000, onClose, mask = false) => {
    let notificationInstance = getNewNotification();
    let icon = 'fa-check-circle';
    switch(type){
        case 'info': icon="fa-info-circle";break;
        case 'warning': icon = 'fa-exclamation-triangle';break;
        case 'error': icon = 'fa-times-circle';break;
        case 'success': icon = 'fa-check-circle';break;
        default:;
    }
    notificationInstance.notice({
        duration,
        mask: mask,
        content: !!icon ? (
            <div className={
                classNames(['zby-toast-box',
                    {'info': type === 'info'},
                    {'success': type === 'success'},
                    {'warning': type === 'warning'},
                    {'error': type === 'error'}
                ])
            }>
                <div className="toast-content"><i className={"fa " + icon}></i>{content}</div>
            </div>
        ) : (
            <div className={
                classNames(['toast-box',
                    {'info': type === 'info'},
                    {'success': type === 'success'},
                    {'warning': type === 'warning'},
                    {'error': type === 'error'}
                ])
            }>
                <div className="zby-toast-content">{content}</div>
            </div>
        ),
        onClose: () => {
            if (onClose) onClose();
        },
    });
};

export default {
    // 无动画
    show(content, duration, mask, onClose) {
        return notice(content, undefined, duration, onClose, mask);
    },
    // 翻转效果
    info(content, duration, mask, onClose) {
        return notice(content, 'info', duration, onClose, mask);
    },
    // 缩放效果
    success(content, duration, mask, onClose) {
        return notice(content, 'success', duration, onClose, mask);
    },
    // 从下方滑入
    warning(content, duration, mask, onClose) {
        return notice(content, 'warning', duration, onClose, mask);
    },
    // 抖动
    error(content, duration, mask, onClose) {
        return notice(content, 'error', duration, onClose, mask);
    },
    // 销毁
    hide() {
        if (newNotification) {
            newNotification.destroy();
            newNotification = null;
        }
    },
}