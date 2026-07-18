package com.sandishaputra.bost;

import android.content.Context;
import android.os.RemoteException;
import android.util.Log;

import androidx.annotation.Keep;

import java.io.BufferedReader;
import java.io.InputStreamReader;

public class UserService extends IUserService.Stub {

    public UserService() {
        Log.i("UserService", "constructor");
    }

    @Keep
    public UserService(Context context) {
        Log.i("UserService", "constructor with Context: " + context);
    }

    @Override
    public void destroy() {
        Log.i("UserService", "destroy");
        System.exit(0);
    }

    @Override
    public void exit() {
        destroy();
    }

    @Override
    public String executeCommand(String command) throws RemoteException {

        try {

            Process process = Runtime.getRuntime().exec(
                    new String[]{"sh", "-c", command}
            );

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream())
            );

            StringBuilder output = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            process.waitFor();

            return output.toString().trim();

        } catch (Exception e) {
            throw new RemoteException(e.getMessage());
        }
    }
}