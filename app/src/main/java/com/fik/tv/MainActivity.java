package com.fik.tv;
import android.app.Activity;
import android.os.Bundle;
import android.graphics.Color;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.webkit.WebResourceRequest;
import android.content.Intent;
import android.provider.Settings;
import android.content.pm.ResolveInfo;
import android.content.pm.PackageManager;
import android.util.Base64;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.JavascriptInterface;
import android.view.KeyEvent;
import android.view.View;
import java.io.ByteArrayOutputStream;
import java.util.*;
import org.json.*;

public class MainActivity extends Activity {
  private WebView browser;
  private final HashSet<String> available = new HashSet<String>();
  private final LinkedHashMap<String,String> iconCache = new LinkedHashMap<String,String>(32,.75f,true){
    @Override protected boolean removeEldestEntry(Map.Entry<String,String> entry){return size()>32;}
  };
  @Override public void onCreate(Bundle b){
    super.onCreate(b);
    getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN|View.SYSTEM_UI_FLAG_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    browser = new WebView(this);
    browser.setBackgroundColor(Color.rgb(7,12,22));
    browser.getSettings().setJavaScriptEnabled(true);
    browser.getSettings().setDomStorageEnabled(true);
    browser.getSettings().setAllowFileAccess(true); // required for bundled assets only
    browser.getSettings().setAllowFileAccessFromFileURLs(false);
    browser.getSettings().setAllowUniversalAccessFromFileURLs(false);
    browser.getSettings().setSupportMultipleWindows(false);
    browser.getSettings().setAllowContentAccess(false);
    browser.getSettings().setDefaultTextEncodingName("UTF-8");
    browser.setWebChromeClient(new WebChromeClient());
    browser.setWebViewClient(new WebViewClient(){
      @Override public boolean shouldOverrideUrlLoading(WebView view, String url){return !url.startsWith("file:///android_asset/");}
      @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req){return !req.getUrl().toString().startsWith("file:///android_asset/");}
    });
    browser.addJavascriptInterface(new Bridge(),"FIKNative");
    setContentView(browser);
    browser.loadUrl("file:///android_asset/index.html");
  }
  private String pngIcon(String pkg){
    try {
      Drawable drawable=getPackageManager().getApplicationIcon(pkg);
      Bitmap bmp=Bitmap.createBitmap(80,80,Bitmap.Config.ARGB_8888);
      Canvas canvas=new Canvas(bmp); drawable.setBounds(0,0,80,80); drawable.draw(canvas);
      ByteArrayOutputStream stream=new ByteArrayOutputStream();bmp.compress(Bitmap.CompressFormat.PNG,100,stream);
      String result="data:image/png;base64,"+Base64.encodeToString(stream.toByteArray(),Base64.NO_WRAP);
      bmp.recycle(); return result;
    } catch(Exception ignored){return "";}
  }
  public class Bridge {
    @JavascriptInterface public synchronized String getApps(){
      JSONArray output=new JSONArray();
      try {
        PackageManager pm=getPackageManager();
        Intent leanback=new Intent(Intent.ACTION_MAIN);leanback.addCategory(Intent.CATEGORY_LEANBACK_LAUNCHER);
        Intent launcher=new Intent(Intent.ACTION_MAIN);launcher.addCategory(Intent.CATEGORY_LAUNCHER);
        List<ResolveInfo> found=new ArrayList<ResolveInfo>();
        found.addAll(pm.queryIntentActivities(leanback,0));
        found.addAll(pm.queryIntentActivities(launcher,0));
        HashSet<String> unique=new HashSet<String>();
        ArrayList<JSONObject> data=new ArrayList<JSONObject>();
        available.clear(); iconCache.clear();
        for(ResolveInfo ri:found){
          if(ri.activityInfo==null)continue;
          String pkg=ri.activityInfo.packageName;
          if(pkg.equals(getPackageName())||!unique.add(pkg))continue;
          Intent launch=pm.getLeanbackLaunchIntentForPackage(pkg);
          if(launch==null)launch=pm.getLaunchIntentForPackage(pkg);
          if(launch==null)continue;
          available.add(pkg);
          JSONObject item=new JSONObject();item.put("name",String.valueOf(ri.loadLabel(pm)));item.put("pkg",pkg);data.add(item);
        }
        Collections.sort(data,new Comparator<JSONObject>(){public int compare(JSONObject a,JSONObject b){return a.optString("name").compareToIgnoreCase(b.optString("name"));}});
        for(JSONObject item:data)output.put(item);
      }catch(Exception ignored){}
      return output.toString();
    }
    @JavascriptInterface public synchronized String getIcon(String pkg){
      if(pkg==null || !available.contains(pkg))return "";
      if(iconCache.containsKey(pkg))return iconCache.get(pkg);
      String result=pngIcon(pkg); iconCache.put(pkg,result);return result;
    }
    @JavascriptInterface public void exitToSystem(){
      runOnUiThread(new Runnable(){@Override public void run(){
        try {
          Intent home=new Intent(Intent.ACTION_MAIN);
          home.addCategory(Intent.CATEGORY_HOME);
          home.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
          startActivity(home);
        }catch(Exception ignored){}
        finish();
      }});
    }
    @JavascriptInterface public synchronized boolean launchPackage(final String pkg){
      if(pkg==null||!available.contains(pkg))return false;
      try{
        PackageManager pm=getPackageManager();
        Intent intent=pm.getLeanbackLaunchIntentForPackage(pkg);
        if(intent==null)intent=pm.getLaunchIntentForPackage(pkg);
        if(intent==null)return false;
        final Intent open=intent;open.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        runOnUiThread(new Runnable(){@Override public void run(){try{startActivity(open);}catch(Exception ignored){}}});return true;
      }catch(Exception ignored){return false;}
    }
  }
  private void remote(String key){if(browser!=null)browser.evaluateJavascript("window.onTVKey && window.onTVKey('"+key+"')",null);}
  @Override public boolean onKeyDown(int code,KeyEvent event){
    switch(code){
      case KeyEvent.KEYCODE_DPAD_LEFT:remote("left");return true;
      case KeyEvent.KEYCODE_DPAD_RIGHT:remote("right");return true;
      case KeyEvent.KEYCODE_DPAD_UP:remote("up");return true;
      case KeyEvent.KEYCODE_DPAD_DOWN:remote("down");return true;
      case KeyEvent.KEYCODE_DPAD_CENTER:case KeyEvent.KEYCODE_ENTER:remote("enter");return true;
      case KeyEvent.KEYCODE_BACK:remote("back");return true;
    }
    return super.onKeyDown(code,event);
  }
  @Override public void onBackPressed(){remote("back");}
  @Override public void onDestroy(){if(browser!=null){browser.destroy();browser=null;}super.onDestroy();}
}
