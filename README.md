# form-input-recover

<!-- [START badges] -->
[![Build Status](https://travis-ci.com/nishimura-yuki/form-input-recover.svg?branch=master)](https://travis-ci.com/nishimura-yuki/form-input-recover)
<!-- [END badges] -->

`form-input-recover` is a JavaScript library which automatically save and recover a form input data.

## Getting Started

### Using CDN

You can use two types javascript files from a CDN.

#### Easy way

##### Load JavaScript
```
<head>
<script src="https://d2t1zo1tr7sobn.cloudfront.net/latest/form-input-recover-view.js"></script>
</head>
```

##### Setup 

Using Modal
```
<script>
FormInputRecover.executeInputRecover( 
  {}, // library options
  {}  // view options
);
</script>
```

Automatical
```
<script>
FormInputRecover.executeInputRecover( 
  {} // library options
);
</script>
```

#### High-Level way

##### Load JavaScript
```
<head>
<script src="https://d2t1zo1tr7sobn.cloudfront.net/latest/form-input-recover.js"></script>
</head>
```

##### Using library as api.
```
<script>
var instance = FormInputRecover.createInstance({
  expiredHour: 1
});
if(instance){
  instance.recoverData();
}
</script>
```

### Options

#### library options
|Name|Type|Description|
|:--:|:--:|:----------|
|**`formId`**|`{String\|String[]}`|`optional` The form element id or ids to observe for recover input data. If not specify form-input-recover will automatically observe the first form element.|
|**`keyPrefix`**|`{String}`|`optional` The key prefix to use for localstorage key name. Default is `__forminputrecover`.|
|**`expiredHour`**|`{Number}`|`optional` The expired hours for stored data in localstorage. Default is `2`.|
|**`password`**|`{String}`|`optional` The password to encrypt and decrypt data in localstorage. Default is `password_forminputrecover` |

#### view options
|Name|Type|Description|
|:--:|:--:|:----------|
|**`elementId`**|`{String}`|`optional` The element id to be injected the modal. |
|**`zIndex`**|`{Number}`|`optional` The z-index for the modal. Default is `1000`. |
|**`lang`**|`{String}`|`optional` Language to be shown on the modal. Default is `en`. |


### Examples

#### Modal

https://d2t1zo1tr7sobn.cloudfront.net/latest/sample-modal.html

#### Automatical
https://d2t1zo1tr7sobn.cloudfront.net/latest/sample-auto.html

#### API
https://d2t1zo1tr7sobn.cloudfront.net/latest/sample-api.html

