/**
 * TapTap Share API (Minigame & H5) Documentation
 * Based on: https://developer.taptap.cn/minigameapidoc/dev/api/open-api/share/
 */

import type { Documentation } from '../../core/utils/docHelpers.js';

/**
 * Share documentation data
 * Uses the generic Documentation interface from core
 */
export const SHARE_DOCUMENTATION: Documentation = {
  title: 'TapTap Share API (Minigame & H5)',
  description: `Complete share functionality for TapTap Minigame and H5 Games, including share panel display, share template management, and share event handling.

⚠️ IMPORTANT:
- NO npm packages or SDK installation required
- NO imports needed
- The 'tap' object is a GLOBAL object provided by TapTap runtime environment
- All APIs are accessed directly via: tap.showShareboard(), tap.setShareboardHidden(), etc.
- Works in TapTap Minigame AND H5 game environments (not in regular web browsers)
- All methods accept a SINGLE object parameter (not multiple parameters)`,
  apiReference: 'https://developer.taptap.cn/minigameapidoc/dev/api/open-api/share/',

  categories: {
    share_panel: {
      title: 'Share Panel Management',
      description: 'Control the display and visibility of the share panel',
      apis: [
        {
          name: 'tap.setShareboardHidden',
          method: 'tap.setShareboardHidden({ hidden, success, fail, complete })',
          description:
            'Set the hidden state of the share panel in the minigame menu. This API only affects the share panel visibility when users click the three-dot menu (more menu) in the top-right corner. It does NOT affect share panels called via tap.showShareboard API.',
          parameters: {
            hidden:
              'boolean (required) - Whether to hide the share panel in user menu. true: hide, false: show',
            success: 'function (optional) - Success callback function',
            fail: 'function (optional) - Failure callback function',
            complete:
              'function (optional) - Complete callback function (called after success or failure)',
          },
          returnValue: 'void - Promise style not supported',
          example: `// Hide share panel in user menu
tap.setShareboardHidden({
  hidden: true,
  success: function (res) {
    console.log('分享面板已设置隐藏');
  },
  fail: function (res) {
    console.log('设置失败:', res.errMsg);
  }
});

// Show share panel in user menu
tap.setShareboardHidden({
  hidden: false,
  success: function (res) {
    console.log('分享面板已设置显示');
  }
});

// Note: Even if hidden in user menu, you can still call share via API
tap.showShareboard({
  templateId: "your_template_id",
  sceneParam: "your_scene_param"
});`,
        },
        {
          name: 'tap.showShareboard',
          method: 'tap.showShareboard({ templateId, sceneParam, success, fail, complete })',
          description:
            'Display the share panel. Note: The callback is for opening the panel, NOT for share success/failure. Use tap.onShareMessage() to listen for share behavior callbacks.',
          parameters: {
            templateId:
              'string (required) - Share template ID (corresponds to template_code from server API)',
            sceneParam:
              'string (optional) - Scene parameter, will be passed to minigame when user opens the share card',
            success: 'function (optional) - Success callback function',
            fail: 'function (optional) - Failure callback function',
            complete: 'function (optional) - Complete callback function',
          },
          returnValue: 'void - Promise style not supported (minimum version: 1.7.0)',
          example: `// Show share panel
tap.showShareboard({
  templateId: "your_template_code",  // Use template_code from createShareTemplate API
  sceneParam: "custom_param",
  success: function (res) {
    console.log(res.errMsg);
  },
  fail: function (res) {
    console.log(res.errNo, res.errMsg);
  },
  complete: function (res) {
    // Called after success or failure
  }
});`,
        },
      ],
    },
    share_events: {
      title: 'Share Event Handling',
      description: 'Listen to and handle share events',
      apis: [
        {
          name: 'tap.onShareMessage',
          method: 'tap.onShareMessage({ success, fail })',
          description: 'Listen to share behavior. You can modify share content in this callback.',
          parameters: {
            success: 'function (optional) - Success callback function',
            fail: 'function (optional) - Failure callback function',
          },
          returnValue: 'void - Promise style not supported (minimum version: 1.7.0)',
          example: `// Listen to share events
tap.onShareMessage({
  success: function (res) {
    console.log("分享渠道:", res.channel);
    console.log("分享成功");
  },
  fail: function (res) {
    console.log("分享失败:", res.errMsg);
  }
});

// Note: This listens for when user clicks a share channel
// The callback parameters include:
// - channel: string - Share channel name
// - errMsg: string - Error message (if any)`,
        },
        {
          name: 'tap.offShareMessage',
          method: 'tap.offShareMessage()',
          description: 'Cancel share behavior listener',
          parameters: {},
          returnValue: 'void - Promise style not supported',
          example: `// Cancel share listener
tap.offShareMessage();

// Use this when you no longer need to listen to share events`,
        },
      ],
    },
  },
};
