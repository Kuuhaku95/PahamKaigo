package com.pahamkaigo.app;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    static final String HOME = "https://kuuhaku95.github.io/PahamKaigo/";
    static final String HOST = "kuuhaku95.github.io";
    WebView web;

    @Override protected void onCreate(Bundle s) {
        super.onCreate(s);
        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#F7F5F0"));
        WebSettings w = web.getSettings();
        w.setJavaScriptEnabled(true);
        w.setDomStorageEnabled(true);
        w.setDatabaseEnabled(true);
        w.setMediaPlaybackRequiresUserGesture(false);
        w.setSupportZoom(false);
        w.setBuiltInZoomControls(false);
        w.setTextZoom(100);
        w.setCacheMode(WebSettings.LOAD_DEFAULT);
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                if (HOST.equals(u.getHost())) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception e) {}
                return true;
            }
        });
        setContentView(web);
        if (s != null) web.restoreState(s); else web.loadUrl(HOME);
    }
    @Override protected void onSaveInstanceState(Bundle o) { super.onSaveInstanceState(o); web.saveState(o); }
    @Override public void onBackPressed() { if (web.canGoBack()) web.goBack(); else super.onBackPressed(); }
}
